'use strict';

/* globals d3, colorbrewer */

/**
 * Infovis directives
 */
angular.module('infovisApp')

  .directive('mapChart', function() {
    return {
      restrict: 'E',
      replace: true,
      template: '<div class="map-chart"></div>',
      link: function (scope, element) {

        var margin = {
          top: 30,
          right: 20,
          bottom: 100,
          left: 50
        };
        var width = 1080 - margin.left - margin.right;
        var height = 850 - margin.top - margin.bottom;

        var projection = d3.geo.mercator()
          .scale(8000)
          .translate([-350, 9000]);
        var path = d3.geo.path()
          .projection(projection);

        var svg = d3.select(element[0])
          .append('svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom);

        var map = svg.append('g')
          .attr('class', 'map');

        var info = svg.append('g')
          .attr('opacity', 0)
          .attr('class', 'info no-select');
        var info_title = info.append('text')
          .attr('x', 800)
          .attr('y', 150)
          .attr('class', 'info-title');
        var info_subtitle = info.append('text')
          .attr('x', 800)
          .attr('y', 200)
          .attr('class', 'info-subtitle');

        d3.json('gem.json', function (error, json) {
          if (error)  { throw error; }

          var colors = d3.scale.quantize()
            .domain([d3.max(json.features, function(d) {
              return d.properties.AANT_INW;
            }), 0])
            .range(colorbrewer.RdYlGn[11]);

          map.selectAll('path')   // select all the current path nodes
            .data(json.features)      // bind these to the features array in json
            .enter().append('path')   // if not enough elements create a new path
            .attr('class', 'segment')
            .attr('fill', function(d) {
              if ( d.properties.WATER === 'JA' ) {
                return '#fff';
              } else {
                return colors(d.properties.AANT_INW);
              }
            })
            .on('mouseover', function(d, i) {
              if ( d.properties.WATER === 'JA' ) return;
              info_title.text(d.properties.GM_NAAM);
              info_subtitle.text('Aantal inwoners: ' + d.properties.AANT_INW);
              info.attr('opacity', 1);
            })
            .on('mouseout', function(d, i) {
              if ( d.properties.WATER === 'JA' ) return;
              info.attr('opacity', 0);
            })
            .attr('stroke', function (d, i) {
              if ( d.properties.WATER === 'JA' ) {
                return '#fff';
              } else {
                return colors(d.properties.AANT_INW);
              }
            })
            .attr('id', function(d) { return d.properties.GM_CODE; })
            .attr('d', path);         // transform the supplied jason geo path to svg
        });
      }
    };
  });
