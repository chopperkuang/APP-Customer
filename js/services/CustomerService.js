/**
 * 对客户操作的业务逻辑
 * User: kuang
 * Date: 13-2-26
 * Time: 上午11:49
 */

'use strict';

app.service('CustomerService', function CustomerService($http, CONF) {
    var self = this;

    /**
     * 查询我的私客
     * @param empNo
     * @return {*}
     */
    self.privateList = function(empNo) {
        var myPrivateApi = CONF.host + "/api/app/myPrivate/"+ empNo +"?callback=JSON_CALLBACK";
        return $http.jsonp(myPrivateApi).then(
            function(response) { //success
                return response.data.inquiryList;
            },
            function(response) {
                console.log("error.");
            }
        );
    }
});
