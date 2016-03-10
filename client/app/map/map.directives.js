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
        var height = 500 - margin.top - margin.bottom;

        // Color range for the map
        var colors = d3.scale.category20();

        var xym = d3.geo.mercator();
        var path = d3.geo.path().projection(xym);

        // the variable that holds our translate, centers on the netherlands
        var translate = xym.translate();
        translate[0] = -500;
        translate[1] = 10640

        // center on the netherlands and zoom all the way in
        xym.translate(translate);
        xym.scale(60000);

        var svg = d3.select(element[0])
          .append("svg")
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .attr("id","svgoriginal");

        var gemeentes = svg.append("g")
            .attr("id", "gemeentes")
            .attr("class", "RdYlGn");

        d3.json("gem.json", function (json) {
            gemeentes.selectAll("path")   // select all the current path nodes
                .data(json.features)      // bind these to the features array in json
                .enter().append("path")   // if not enough elements create a new path
                .attr("fill",function(d,i){return colors(i)})
                .attr("class", "")  // add attribute class and fill with result from quantize
                .attr("id", "")
                .attr("d", path)          // transform the supplied jason geo path to svg
        });
      }
    };
  });
