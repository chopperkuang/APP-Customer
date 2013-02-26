'use strict';
/**
 * 客户列表展示
 * User: kuang
 */
app.controller('ListController', function ListController($scope, $http, CustomerService) {
    $scope.title = "test";

    CustomerService.privateList(83639).then(function(data){
        $scope.customers = data;
    });

});
