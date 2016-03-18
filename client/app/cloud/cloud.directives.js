'use strict';

/* globals d3, colorbrewer */

/**
 * Infovis directives
 */
angular.module('infovisApp')

  .directive('wordCloud', function() {
    return {
      restrict: 'E',
      replace: true,
      template: '<div class="cloud"></div>',
      link: function (scope, element) {

        var svg = d3.select(element[0])
          .append('svg')
          .attr('preserveAspectRatio', 'xMinYMin meet')
          .attr('viewBox', '0 0 960 500')
          .attr('class', 'svg');
      }
    };
  });
