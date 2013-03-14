/**
 * 对客户操作的业务逻辑
 * User: kuang
 * Date: 13-2-26
 * Time: 上午11:49
 */

'use strict';

app.service('CustomerService', function CustomerService($http, CONF, Employee) {
    var self = this;

    /**
     * 查询我的私客
     * @param empNo
     * @return {*}
     */
    self.privateList = function() {

        var config = {
            params: {token:Employee.accessToken}
        };
        return $http.get(CONF.host + "?method=ky.private.list", config).then(
            function(response) { //success
                return response.data.inquiryList;
            },
            function(response) { //error
                console.log("error.");
            }
        );
    };

    self.customerPhones = function(inquiryId) {
        var config = {
            params: {inquiryId:inquiryId}
        };
        return $http.get(CONF.host + "?method=ky.phone.list", config).then(
            function(response) { //success
                return response.data.contactList;
            },
            function(response) { //error
                console.log("error.");
            }
        );
    }
});
