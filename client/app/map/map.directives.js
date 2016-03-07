'use strict';

/**
 * Infovis directives
 */
angular.module('infovisApp')

  .directive('mapChart', function() {
    return {
      restrict: 'E',
      replace: true,
      template: '<div class="map-chart"></div>',
      link: function (scope, element, attrs) {

        var margin = {
          top: 30,
          right: 20,
          bottom: 50,
          left: 50
        };

        var width = 960 - margin.left - margin.right;
        var height = 500 - margin.top - margin.bottom;

        var svg = d3.select(element[0])
          .append('svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        // Show currently selected year
        svg.append('text')
          .attr('class', 'label')
          .attr('x', 0)
          .attr('y', 0)
          .text('add map vis here');
      }
    };
  });
