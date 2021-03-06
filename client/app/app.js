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
])
  .config(function($urlRouterProvider, $locationProvider) {

    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode(true);
  });
