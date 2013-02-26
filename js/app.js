/**
 * 配置路由
 * User: kuang
 * Date: 13-2-25
 * Time: 下午6:13
 */

'use strict';

var app = angular.module('customerApp', []);

app.config(function($routeProvider) {
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
});

