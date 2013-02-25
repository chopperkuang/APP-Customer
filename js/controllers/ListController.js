'use strict';

app.controller('ListController', function ListController($scope, $http, CONF) {
    $scope.title = "test";
    $scope.host = CONF.host;
});
