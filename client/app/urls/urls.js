'use strict';

angular.module('infovisApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('urls', {
        url: '/urls',
        templateUrl: 'app/urls/urls.html',
        controller: 'UrlsController',
        controllerAs: 'urls'
      });
  });
