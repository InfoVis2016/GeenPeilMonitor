'use strict';

angular.module('infovisApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('urlBar', {
        url: '/urlBar',
        templateUrl: 'app/urlBar/urlBar.html',
        controller: 'UrlBarController',
        controllerAs: 'urlBar'
      });
  });
