/**
 * 配置路由
 * User: kuang
 * Date: 13-2-25
 * Time: 下午6:13
 */

'use strict';
//window.localStorage.clear();

//the HTTP headers to be used by all requests
var httpHeaders;

var app = angular.module('customerApp', ['ngResource', 'dy.format', 'phonegap.notification']);
app.config(function($routeProvider, $httpProvider) {
    $routeProvider.
        when('/list', {
            controller: 'ListController',
            templateUrl: 'views/list.html'
        }).
        when('/login', {
            controller: 'LoginController',
            templateUrl: 'views/login.html'
        }).
        otherwise({
            redirectTo: '/list'
        });

    //拦截$http请求中，如果出现401（未通过验证）的错误，并且通知需要登录事件
    $httpProvider.responseInterceptors.push(function ($rootScope, $q) {
        return function (promise) {
            return promise.then(
                //success -> don't intercept
                function (response) {
                    return response;
                },
                //error -> if 401 save the request and broadcast an event
                function (response) {
                    if (response.status === 401) {
                        var deferred = $q.defer(),
                            req = {
                                config: response.config,
                                deferred: deferred
                            };
                        $rootScope.requests401.push(req);
                        $rootScope.$broadcast('event:loginRequired');
                        return deferred.promise;
                    }
                    return $q.reject(response);
                }
            );
        };
    });
    httpHeaders = $httpProvider.defaults.headers;

    if(window.sessionStorage.accessToken != null) {
        httpHeaders.common['Authorization'] = 'Bearer ' + window.sessionStorage.accessToken;
    }

    $httpProvider.defaults.transformRequest = function(data) {
        console.log(data);
        return data;
    }
});

app.run(function ($rootScope, $http, $location, Employee, EmployeeService, Base64, MD5) {

    /**
     * Holds all the requests which failed due to 401 response.
     */
    $rootScope.requests401 = [];

    $rootScope.$on('event:loginRequired', function () {
        $location.url("/login");
    });

    /**
     * On 'event:loginConfirmed', resend all the 401 requests.
     */
    $rootScope.$on('event:loginConfirmed', function () {
        var i,
            requests = $rootScope.requests401,
            retry = function (req) {
                $http(req.config).then(function (response) {
                    req.deferred.resolve(response);
                });
            };

        for (i = 0; i < requests.length; i += 1) {
            retry(requests[i]);
        }
        $rootScope.requests401 = [];
    });

    /**
     * On 'event:loginRequest' send credentials to the server.
     */
    $rootScope.$on('event:loginRequest', function (event, empNo, password) {
        //todo 这些可做常量配置，包括计算signStr，因为是不变的数据
        var clientId = "APP-Customer";
        var clientSecret = "KiowPdfsal2380jfdsl";
        var username = empNo
        var passwordSec = MD5.encode(password);
        var signStr = username + passwordSec + clientId + clientSecret;

        var tokenConfig = {
            params:{client_id: clientId, client_secret: clientSecret, grant_type:'password', code:Base64.encode(username + ":" + passwordSec + "aB1c"), sign: MD5.encode(signStr)},
            headers:{
                'Authorization':'Basic ' + Base64.encode(clientId + ":" + clientSecret),
                'Accept': 'application/json'
            }
        };

        $http.post('http://api.dooioo.com:18080/oauth/token', "", tokenConfig).then(
            function(response) { //success
                window.sessionStorage.accessToken = response.data.access_token;
                Employee.accessToken = response.data.access_token;
                httpHeaders.common['Authorization'] = 'Bearer ' + Employee.accessToken;

                //todo 该段逻辑可以跟API合并，在登录成功后将数据进行返回
                EmployeeService.getEmployee(empNo).then(
                    function(data){
                        angular.forEach(data, function(value, key){
                            this[key] = value; //this指代Employee
                        }, Employee);
                        window.sessionStorage.lastSign = new Date();
                        $location.url('/list');
                    },
                    function(response) {
                        alert("用户不存在！");
                        $rootScope.$emit('event:loginRequired');
                    }
                );

            },
            function(response) { //error
                alert("登录失败！");
                $rootScope.$emit('event:loginRequired');
            }
        );
    });

    /**
     * On 'logoutRequest' invoke logout on the server and broadcast 'event:loginRequired'.
     */
    $rootScope.$on('event:logoutRequest', function () {
        httpHeaders.common['Authorization'] = null;
        window.sessionStorage.lastSign = null;
        window.sessionStorage.accessToken = null;
    });
});

/**
 * url白名单设置
 */
app.config(function($compileProvider){
    $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel|sms):/);
});