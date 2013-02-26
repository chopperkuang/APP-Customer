'use strict';
/**
 * 客户列表展示
 * User: kuang
 */
app.controller('ListController', function ListController($scope, $http, CustomerService) {

    $scope.popupShow = 'hidden';
    $scope.popupSelectShow = 'hidden';
    $scope.iframeShow = 'hidden';
    $scope.sidebarShow = '';

    CustomerService.privateList(83639).then(function(data){
        $scope.customerList = data;
    });


    // to show the popup window of calling
    $scope.call = function(num) {
        this.popupShow = '';
        this.iframeShow = '';
    };

    // to hide the popup window of calling
    $scope.callCancel = function(){
        this.popupShow = 'hidden';
        this.iframeShow = 'hidden';
    };

    // to show the popup window of selecting phone number
    $scope.callSelect = function(type){
        this.call_type = type;
        this.popupShow = 'hidden';
        this.popupSelectShow = '';
    };

    // to hide the popup window of selecting phone number
    $scope.selectCancel = function(){
        this.popupSelectShow = 'hidden';
        this.iframeShow = 'hidden';
    }

    // to show or hide sidebar
    $scope.sidebarSwitch = function(){
        if(this.sidebarShow == ''){
            this.sidebarShow = 'sidebarShow';
        }
        else{
            this.sidebarShow = '';
        }
    }

});
