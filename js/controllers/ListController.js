'use strict';
/**
 * 客户列表展示
 * User: kuang
 */

app.controller('ListController', function ListController($scope, $http, $location, $route, CustomerService, EmployeeService, Employee, notification) {
    if(!Employee.id || !window.sessionStorage.lastSign){
        $location.url('/login');
    }
    else {
        //显示|隐藏 状态初始化
        //客户列表
        $scope.noRecordShow = 'hidden';
        $scope.listShow = 'hidden';
        //操作弹层初始化
        $scope.popupCallShow = 'hidden';
        $scope.popupCallMultiShow = 'hidden';
        $scope.popupSelectShow = 'hidden';
        $scope.iframeShow = 'hidden';
        //侧边栏
        $scope.sidebarShow = '';
        //todo 这类对弹层的操作，可以由指令来完成(进行封装)，因此部分弹层是互斥的



        $scope.predicate = '-lastFollowDate';
        //获取客户列表
        CustomerService.privateList().then(function(data){
            $scope.customerList = data;
            if($scope.customerList.length == 0){//暂无客户
                $scope.listShow = 'hidden';
                $scope.noRecordShow = '';
            }
            else{//有客户
                $scope.noRecordShow = 'hidden';
                $scope.listShow = '';
            }
        });
    }

    /**
     * 刷新列表，更新数据
     */
    $scope.refresh = function(){
        $route.reload();
    };

    /**
     * 打电话，发短信操作
     */
    $scope.call = function(inquiryId) { 
        if($scope.sidebarShow != ''){
            return false;
        }
        CustomerService.customerPhones(inquiryId).then(function(data){
            console.log('contacts:'+JSON.stringify(data));
            $scope.contacts = data;
            if($scope.contacts.length == 0){//无联系方式
                return false;
            }
            if($scope.contacts.length == 1 && $scope.contacts[0].phoneList.length == 1){ // 一个电话
                $scope.phoneNumber = $scope.contacts[0].phoneList[0].phoneNumber;
                $scope.popupCallShow = '';
            }
            else{ // 多个电话
                $scope.popupCallMultiShow = '';
            }
            $scope.iframeShow = '';
        });
        
    };

    /**
     * 取消打电话、发短信操作
     */
    $scope.callCancel = function(){
        if($scope.popupCallShow == ''){ // 一个电话
            $scope.popupCallShow = 'hidden';
        }
        if($scope.popupCallMultiShow == ''){ // 多个电话
            $scope.popupCallMultiShow = 'hidden';
        }
        $scope.iframeShow = 'hidden';
    };

    /**
     * 选择电话号码
     */
    $scope.callSelect = function(type){
        $scope.callType = type;
        if(type == 'tel'){
            $scope.operType = '打电话'
        }
        if(type == 'sms'){
            $scope.operType = '发短信'
        }
        $scope.popupCallMultiShow = 'hidden';
        $scope.popupSelectShow = '';
    };

    /**
     * 取消选择电话号码
     */
    $scope.selectCancel = function(){
        $scope.popupSelectShow = 'hidden';
        $scope.iframeShow = 'hidden';
    };

    /**
     * 展开、收缩侧边栏
     */
    $scope.sidebarSwitch = function(){
        if($scope.sidebarShow == ''){
            $scope.sidebarShow = 'sidebar_show';
        }
        else{
            $scope.sidebarShow = '';
        }
    };

    /**
     * 更新最近拨打时间
     */
    $scope.updateLastCall = function(type){
        if(type == 'tel'){
            //alert('last time of calling is:' + new Date());
            console.log('last time of calling is:' + new Date());
        }
    };

    /**
     * 注销
     */
    $scope.logout = function(){
        EmployeeService.logout();
    }
});
