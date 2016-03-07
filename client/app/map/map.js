'use strict';

angular.module('infovisApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('map', {
        url: '/map',
        templateUrl: 'app/map/map.html',
        controller: 'MapController',
        controllerAs: 'map'
      });
  });
