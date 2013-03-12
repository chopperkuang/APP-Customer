/**
 * 对用户操作的业务逻辑
 * User: Liao
 * Date: 13-3-1
 * Time: 下午1:24
 */

'use strict';


app.service('EmployeeService', function EmployeeService($http, $location, Employee, Base64, MD5) {
    var self = this;

    var FAIL = {status:'fail'};
    var OK = {status:'ok'};

    /**
     * 用户登录
     * @param empNo, empPassword
     * @return {*}
     */
    self.login = function(empNo, password) {
        //todo 先实现效果，代码后续再封装
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

        return $http.post('http://api.dooioo.com:18080/oauth/token', "", tokenConfig).then(
            function(response) { //success
                if(response.status == 200) {
                    console.log(response.data);
                    Employee.accessToken = response.data.access_token;
                    return self.getEmployee(empNo);
                } else {
                    return FAIL;
                }
            },
            function(response) { //error
                console.log(response.status);
                return FAIL;
            }
        ); //~end post
    }; //~end login

    self.getEmployee = function(empNo) {
        var config = {
            params: {empNo:empNo}
        };
        return $http.get("http://api.dooioo.com:18080/route/rest?method=oms.employee.get", config).then(
            function(response) {
                return response.data;
            },
            function(response) {
                return FAIL;
            }
        );
    }

    self.logout = function(){
        window.sessionStorage.lastSign = undefined;
        Employee.accessToken = undefined; //todo 发送请求清除accessToken(暂无API)
        $location.url('/login');
    };

});



/**
 * 用户信息接口（监听变化，更新LOCAL）
 */

app.factory('Employee', function($rootScope) {

    var LOCAL_STORAGE_ID = 'EmployeeLocal',
        employeeString = window.localStorage[LOCAL_STORAGE_ID];


    var employee = employeeString ? JSON.parse(employeeString) : {};

    $rootScope.$watch(
        function() { 
            return employee;
        }, 
        function() { 
            window.localStorage[LOCAL_STORAGE_ID] = JSON.stringify(employee);
        },
        true);

    return employee;
});