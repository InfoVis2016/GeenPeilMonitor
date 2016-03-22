'use strict';

angular.module('infovisApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('meteo', {
        url: '/meteo',
        templateUrl: 'app/meteo/meteo.html',
        controller: 'MeteoController',
        controllerAs: 'meteo'
      });
  });
