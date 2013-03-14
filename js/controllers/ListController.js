'use strict';
/**
 * 客户列表展示
 * User: kuang
 */

app.controller('ListController', function ListController($scope, $http, $location, $route, CustomerService, EmployeeService, Employee, notification) {
    if(!Employee.accessToken || !window.sessionStorage.lastSign){
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
        $scope.smsShow = '';
        //侧边栏
        $scope.sidebarShow = '';
        //todo 这类对弹层的操作，可以由指令来完成(进行封装)，因此部分弹层是互斥的



        $scope.predicate = '-lastFollowDate';
        //获取客户列表
        CustomerService.privateList().then(function(data){
            $scope.customerList = data;
            console.log(JSON.stringify(data));
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
        if(!Employee.accessToken || !window.sessionStorage.lastSign){
            $location.url('/login');
        }

        $scope.predicate = '-lastFollowDate';
        //先提交localStorage中LOCALlastFollowDate，成功后获取客户列表
        //获取客户列表
        CustomerService.privateList().then(function(data){
            $scope.customerList = data;
            if($scope.customerList.length == 0){//暂无客户
                $scope.listShow = 'hidden';
                $scope.noRecordShow = '';
            }
            else {//有客户
                $scope.noRecordShow = 'hidden';
                $scope.listShow = '';
            }
        });
    };

    /**
     * 打电话，发短信操作
     */
    $scope.call = function(inquiryId) { 
        if($scope.sidebarShow != ''){
            $scope.sidebarShow = '';
            return false;
        }
        CustomerService.customerPhones(inquiryId).then(function(data){
            console.log('contacts:'+JSON.stringify(data));
            $scope.contacts = data;
            if($scope.contacts.length == 0){//无联系方式
                return false;
            }
            
            $scope.inquiryId = $scope.contacts[0].inquiryId;
            if($scope.contacts.length == 1 && $scope.contacts[0].phoneList.length == 1){ // 一个电话
                $scope.phoneNumber = $scope.contacts[0].phoneList[0].phoneNumber;
                
                //固定电话不提供发短信接口
                if(!app.regCellPhone.test($scope.phoneNumber)){
                    $scope.smsShow = 'hidden';
                }
                else{
                    $scope.smsShow = '';
                }

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
     * 更新最近拨打时间(以客户端时间为准)
     */
    $scope.updateLastFollowDate = function(type, inquiryId){
        if(type == 'tel'){
            var lastFollowDate = new Date().getTime();

            //更新页面上最近拔打时间并重新排序
            angular.forEach($scope.customerList, function(value, key){
                if(value.inquiryId == inquiryId){
                    value.lastFollowDate = lastFollowDate;
                }
            });

            //将最近拔打时间提交到后台
            //分支1：网络不通，记入localStorage（下次从后台更新列表数据之前，先提交队列再更新）
            if(window.localStorage.getItem('LOCALlastFollowDate')){//队列不为空
                var arrayLastFollowDate = JSON.parse(window.localStorage.getItem('LOCALlastFollowDate'));
                var isInQueue = false;
                angular.forEach(arrayLastFollowDate, function(value, key){//己在队列中，覆盖
                    if(value.inquiryId == inquiryId){
                        value.lastFollowDate = lastFollowDate;
                        isInQueue = true;    
                        return false;
                    }
                });
                if(!isInQueue){//不在队列中，追加
                    arrayLastFollowDate.push({'inquiryId':inquiryId, 'lastFollowDate':lastFollowDate});
                }
                var strLastFollowDate = JSON.stringify(arrayLastFollowDate);
            }
            else{//队列空，直接添加
                var strLastFollowDate = JSON.stringify([{'inquiryId':inquiryId, 'lastFollowDate':lastFollowDate}]);
            }
            window.localStorage.setItem('LOCALlastFollowDate', strLastFollowDate);
            //分支2：网络通，则直接存入后台，并清空localStorage中LOCALlastFollowDate
            //$http.post(xxxxx);
            //window.localStorage.removeItem('LOCALlastFollowDate');
        }
    };

    /**
     * 注销
     */
    $scope.logout = function(){
        EmployeeService.logout();
    }
});
