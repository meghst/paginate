/** MDM Main Module */
var mdm = angular.module('mdmUI', ['mdmUI.controllers', 'mdmUI.services', 'mdmUI.directives', 'ngRoute']);

mdm.config(function ($routeProvider) {
    $routeProvider
      .when('/masterdata/vendors', {
        templateUrl: 'views/entitylist.html',
        controller: 'dashboard'
      })
      .otherwise({
        redirectTo: '/'
      });

  });

var mdmServer = 'http://ekl-core-0002.stage.ch.flipkart.com:8080';
