/**
 * 配置路由
 * User: kuang
 * Date: 13-2-25
 * Time: 下午6:13
 */

'use strict';

var customerApp = angular.module('customerApp', []);

customerApp.config(function($routeProvider) {
    $routeProvider.
        when('/list', {
            controller: 'ListController',
            templateUrl: 'views/list.html'
        }).
        otherwise({
            redirectTo: '/list'
        });
});

