'use strict';

angular.module('infovisApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('cloud', {
        url: '/cloud',
        templateUrl: 'app/cloud/cloud.html',
        controller: 'CloudController',
        controllerAs: 'cloud'
      });
  });
