'use strict';

/* globals d3, topojson */

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

        var svg = d3.select(element[0])
          .append('svg')
          .attr('preserveAspectRatio', 'xMinYMin meet')
          .attr('viewBox', '0 0 960 500')
          .attr('class', 'svg');

        var map = svg.append('g')
          .attr('class', 'map');

        var projection = d3.geo.mercator()
          .scale(5000)
          .translate([-250, 5600]);

        var path = d3.geo.path()
          .projection(projection);

        var info = svg.append('g')
          .attr('opacity', 0)
          .attr('class', 'info');
        var info_title = info.append('text')
          .attr('x', 500)
          .attr('y', 50)
          .attr('class', 'info-title');
        var info_subtitle = info.append('text')
          .attr('x', 500)
          .attr('y', 75)
          .attr('class', 'info-subtitle');

        d3.json('map.json', function(error, data) {
          if (error) { throw error; }

          var subunits = topojson.feature(data, data.objects.gem);

          map.selectAll('path')
            .data(subunits.features)
            .enter().append('path')   // if not enough elements create a new path
            .attr('class', 'segment')
            .attr('fill', function(d) {
              if ( d.properties.WATER === 'JA' ) {
                return 'rgba(0,0,0,0)';
              } else {
                return d.properties.in_favor ? '#5FFF60' : '#E53F31';
              }
            })
            .on('mouseover', function(d) {
              if ( d.properties.WATER === 'JA' ) { return; }
              d3.select(this).style('fill', '#555555');
              info_title.text(d.properties.GM_NAAM);
              info_subtitle.text('Aantal inwoners: ' + d.properties.AANT_INW);
              info.attr('opacity', 1);
            })
            .on('mouseout', function(d) {
              if ( d.properties.WATER === 'JA' ) { return; }
              info.attr('opacity', 0);
              d3.select(this).style('fill', d.properties.in_favor ? '#5FFF60' : '#E53F31');
            })
            .attr('stroke', function (d) {
              if ( d.properties.WATER === 'JA' ) {
                return '#fff';
              } else {
                return '#ccc';
              }
            })
            .attr('id', function(d) {
              return d.properties.GM_CODE;
            })
            .attr('d', path);         // transform the supplied jason geo path to svg
        });
      }
    };
  });
