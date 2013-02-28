'use strict';
/**
 * 客户登录页
 * User: liao
 */

app.controller('LoginController', function LoginController($scope, $http, $location, CustomerService, notification){
    $scope.uname = '83124';
    $scope.pass = 'lq546';
    
    /**
     * 用户登录
     */
    $scope.login = function(){
        CustomerService.userLogin($scope.uname, $scope.pass).then(function(data){
            if(data.status == 'ok'){
                window.sessionStorage.setItem('lastSign', new Date());
                $location.url('/list');
            }
            else{
                alert('用户名或密码错，请重试');
            }
        });
    };
});
