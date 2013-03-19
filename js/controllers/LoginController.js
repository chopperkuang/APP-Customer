'use strict';
/**
 * 客户登录页
 * User: liao
 */

app.controller('LoginController', function LoginController($scope, $http, $route, $location, EmployeeService, notification, Employee){
    $scope.employee = {};
    
    /**
     * 用户登录
     */
    $scope.login = function(employee){
        if(navigator.connection.type === Connection.NONE) {
            alert("请连接网络～");
            return false;
        }

        if(!employee.id){
            alert('请输入工号');
            return false;
        }
        if(!employee.password){
           alert('请输入密码');
            return false;
        }

        $scope.$emit('event:loginRequest', employee.id, employee.password);
    };
});