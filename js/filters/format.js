/**
 * 将各种值进行格式化的过滤器
 * User: kuang
 * Date: 13-2-26
 * Time: 下午5:11
 */

/**
 * 格式化房型
 */
var filter = angular.module('dy.format', []);

filter.filter('formatRoom', function(){

    return function(customer) {
        var retStr = "";
        if(customer.countF > 0) {
            retStr += customer.countF + "室";
        }
        if(customer.countT > 0) {
            retStr += customer.countT + "厅";
        }
        if(customer.countW > 0) {
            retStr += customer.countW + "卫";
        }
        return retStr;
    }
});

/**
 * 格式化时间
 */
filter.filter('fromNow', function(){
    return function(dateString, format) {
        if(dateString == undefined) {
            return moment().format('MM/dd');
        }

        var beforeDate = moment(dateString).format(format);
        var nowDate = moment();

        if(nowDate.diff(beforeDate, 'days') > 1) {
            return moment(dateString).fromNow();
        }
        return moment(dateString).format('HH:mm');
    };
});