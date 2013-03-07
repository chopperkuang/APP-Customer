/**
 * 对用户操作的业务逻辑
 * User: Liao
 * Date: 13-3-1
 * Time: 下午1:24
 */

'use strict';


app.service('EmployeeService', function EmployeeService($http, $location, Employee) {
    var self = this;

    /**
     * 用户登录
     * @param empNo, empPassword
     * @return {*}
     */
    self.userLogin = function(empId, empPassword) {
        var loginApi = 'http://10.8.11.34:8090/api/app/login/' + empId + '/' + empPassword + '?callback=JSON_CALLBACK';
        return $http.jsonp(loginApi).then(
            function(response) { //success
                return response.data;
            },
            function(response) { //error
                alert("登录请求失败，请重试");
            }
        );
    };
    self.userLogout = function(){
        Employee.id = undefined;
        $location.url('/login');
    }
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