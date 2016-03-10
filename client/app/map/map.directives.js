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
          bottom: 100,
          left: 50
        };
        var width = 960 - margin.left - margin.right;
        var height = 850 - margin.top - margin.bottom;

        // Color range for the map
        var colors = d3.scale.category20();

        var projection = d3.geo.mercator()
          .scale(8000)
          .translate([-350, 9000]);
        var path = d3.geo.path()
          .projection(projection);

        var svg = d3.select(element[0])
          .append("svg")
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom);

        var gemeentes = svg.append("g")
            .attr("id", "gemeentes")
            .attr("class", "RdYlGn");

        d3.json("gem.json", function (json) {
            gemeentes.selectAll("path")   // select all the current path nodes
                .data(json.features)      // bind these to the features array in json
                .enter().append("path")   // if not enough elements create a new path
                .attr("fill",function(d,i){return colors(i)})
                .attr("stroke", "#fff")
                .attr("class", "gemeente")  // add attribute class and fill with result from quantize
                .attr("id", function(d) { return d.properties.GM_CODE; })
                .attr("d", path)          // transform the supplied jason geo path to svg
        });
      }
    };
  });
