'use strict';

/* globals d3, colorbrewer, topojson */

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

        var parties = {
          '50PLUS': true,
          'Christen Democratisch Appèl (CDA)': true,
          'ChristenUnie': false,
          'Democraten 66 (D66)': true,
          'GROENLINKS': true,
          'PVV (Partij voor de Vrijheid)': false,
          'Partij van de Arbeid (P.v.d.A.)': true,
          'Partij voor de Dieren': false,
          'SP (Socialistische Partij)': false,
          'Staatkundig Gereformeerde Partij (SGP)': false,
          'VVD': true
        };

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

          var colors = d3.scale.quantize()
            .domain([d3.max(subunits.features, function(d) {
              return d.properties.AANT_INW;
            }), 0])
            .range(colorbrewer.RdYlGn[11]);

          map.selectAll('path')
            .data(subunits.features)
            .enter().append('path')   // if not enough elements create a new path
            .attr('class', 'segment')
            .attr('fill', function(d) {
              if ( d.properties.WATER === 'JA' ) {
                return '#fff';
              } else {
                var count = 0;
                for ( var key in parties ) {
                  if ( parties.hasOwnProperty(key) ) {
                    count = parties[key] ? count + d.properties[key] : count - d.properties[key];
                  }
                }
                return count > 0 ? 'green' : 'red'
              }
            })
            .on('mouseover', function(d) {
              if ( d.properties.WATER === 'JA' ) { return; }
              info_title.text(d.properties.GM_NAAM);
              info_subtitle.text('Aantal inwoners: ' + d.properties.AANT_INW);
              info.attr('opacity', 1);
            })
            .on('mouseout', function(d) {
              if ( d.properties.WATER === 'JA' ) { return; }
              info.attr('opacity', 0);
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
