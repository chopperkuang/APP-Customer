'use strict';
/**
 * 客户列表展示
 * User: kuang
 */

app.controller('ListController', function ListController($scope, $http, $location, CustomerService, notification) {
    if(!window.sessionStorage.getItem('lastSign')){
         $location.url('/login');
    }
    else{

        // operation popup init
        $scope.popupCallShow = 'hidden';
        $scope.popupCallMultiShow = 'hidden';
        $scope.popupSelectShow = 'hidden';
        $scope.iframeShow = 'hidden';
        $scope.sidebarShow = '';

        $scope.predicate = '-lastFollowDate';

        CustomerService.privateList(83639).then(function(data){
            $scope.customerList = data;
        });
    }

    /**
     * 刷新列表，更新的数据
     */
    $scope.refresh = function(){
        $location.url("/list");
    };

    /**
     * 打电话，发短信等操作
     */
    $scope.call = function() { 
        $scope.contacts = [
                {
                    contactName:"张先生",
                    createEmpNo:80001,
                    createdAt:1343594923520,
                    email:null,
                    id:403630,
                    inquiryId:"110905115023DAD97839213E8039B19C",
                    others:null,
                    phoneList:[
                        {
                            city:null,
                            createEmpNo:80001,
                            createdAt:1343594923540,
                            custName:null,
                            id:435728,
                            inquiryContactId:403630,
                            inquiryId:"110905115023DAD97839213E8039B19C",
                            inquiryTelExtNumber:null,
                            maskedNumber:null,
                            message:null,
                            netWork:null,
                            office:false,
                            orgId:0,
                            phoneNumber:"13900000001",
                            province:null,
                            same:false,
                            sameEmpName:null,
                            sameOrgName:null,
                            sevencount:0,
                            status:0,
                            updatedAt:null
                        }
                    ],
                    relationship:null,
                    residence:null,
                    status:0,
                    updatedAt:null
                },
                {
                    contactName:"小张先生",
                    createEmpNo:83639,
                    createdAt:1361863277433,
                    email:"chopperkuang@gmail.com",
                    id:628654,
                    inquiryId:"110905115023DAD97839213E8039B19C",
                    others:"",
                    phoneList:[
                        {
                            city:"上海",
                            createEmpNo:83639,
                            createdAt:1361863277437,
                            custName:null,
                            id:681835,
                            inquiryContactId:628654,
                            inquiryId:"110905115023DAD97839213E8039B19C",
                            inquiryTelExtNumber:null,
                            maskedNumber:null,
                            message:null,
                            netWork:"中国联通 GSM",
                            office:false,
                            orgId:0,
                            phoneNumber:"18616899342",
                            province:"上海",
                            same:false,
                            sameEmpName:null,
                            sameOrgName:null,
                            sevencount:0,
                            status:0,
                            updatedAt:null
                        },
                        {
                            city:"上海",
                            createEmpNo:83639,
                            createdAt:1361863277600,
                            custName:null,
                            id:681836,
                            inquiryContactId:628654,
                            inquiryId:"110905115023DAD97839213E8039B19C",
                            inquiryTelExtNumber:null,
                            maskedNumber:null,
                            message:null,
                            netWork:"中国联通 GSM",
                            office:false,
                            orgId:0,
                            phoneNumber:"18616899343",
                            province:"上海",
                            same:false,
                            sameEmpName:null,
                            sameOrgName:null,
                            sevencount:0,
                            status:0,
                            updatedAt:null
                        }
                    ],
                    relationship:"儿子",
                    residence:null,
                    status:0,
                    updatedAt:null
                }
            ];
        if($scope.contacts.length == 1){ // single number
            $scope.popupCallShow = '';
        }
        else{ // multiple number
            $scope.popupCallMultiShow = '';
        }
        $scope.iframeShow = '';
    };

    /**
     * 取消打电话、发短信操作
     */
    $scope.callCancel = function(){
        if($scope.popupCallShow == ''){ // single number
            $scope.popupCallShow = 'hidden';
        }
        if($scope.popupCallMultiShow == ''){ // multiple number
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
    $scope.signOut = function(){
        window.sessionStorage.removeItem('lastSign');
        $location.url('/login');
    }
});
