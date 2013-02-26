'use strict';
/**
 * 客户列表展示
 * User: kuang
 */
app.controller('ListController', function ListController($scope, $http, CustomerService) {

    $scope.popup_show = 'hidden';
    $scope.popup_select_show = 'hidden';
    $scope.iframe_show = 'hidden';
    $scope.sidebar_show = '';

    CustomerService.privateList(83639).then(function(data){
        $scope.customerList = data;
    });


    // to show the popup window of calling
    $scope.call = function(num) {
        this.popup_show = '';
        this.iframe_show = '';
    };

    // to hide the popup window of calling
    $scope.callCancel = function(){
        this.popup_show = 'hidden';
        this.iframe_show = 'hidden';
    };

    // to show the popup window of selecting phone number
    $scope.callSelect = function(type){
        this.call_type = type;
        this.popup_show = 'hidden';
        this.popup_select_show = '';
    };

    // to hide the popup window of selecting phone number
    $scope.selectCancel = function(){
        this.popup_select_show = 'hidden';
        this.iframe_show = 'hidden';
    }

    // to show or hide sidebar
    $scope.sidebarSwitch = function(){
        if(this.sidebar_show == ''){
            this.sidebar_show = 'sidebar_show';
        }
        else{
            this.sidebar_show = '';
        }
    }

});
