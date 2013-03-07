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
        if(!employee.id){
            alert('请输入工号');
            return false;
        }
        if(!employee.password){
           alert('请输入密码');
            return false;
        }

        EmployeeService.userLogin(employee.id, employee.password).then(function(data){
            if(data.status == 'ok'){
                //Employee = data;
                angular.forEach(data, function(value, key){
                    this[key] = value; //this指代Employee
                }, Employee);
                window.sessionStorage.lastSign = new Date();

                $location.url('/list');
            }
            else{
                alert('工号或密码错，请重试');
            }
        });
    };
});