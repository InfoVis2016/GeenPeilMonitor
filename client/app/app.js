'use strict';

angular.module('infovisApp', [
  'infovisApp.constants',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ngMaterial',
  'hj.scrollMagic',
  'infovisApp.bar',
])
  .config(function($urlRouterProvider, $locationProvider, scrollMagicProvider) {

    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode(true);

    scrollMagicProvider.addIndicators = true;
  });

angular.module('infovisApp.bar', []);
