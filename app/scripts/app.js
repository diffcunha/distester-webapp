'use strict';

var distester = angular.module('distester', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ui.bootstrap',
    'ui.select',
    'ui.slider'
]);

distester.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
    })
    .otherwise({
        redirectTo: '/'
    });
}]);

distester.config(['uiSelectConfig', function(uiSelectConfig) {
    uiSelectConfig.theme = 'bootstrap';
}]);