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
           var info_subtitle1 = info.append('text')
          .attr('x', 500)
          .attr('y', 100)
          .attr('class', 'info-subtitle');
           var info_subtitle2 = info.append('text')
          .attr('x', 500)
          .attr('y', 125)
          .attr('class', 'info-subtitle');
           var info_subtitle3 = info.append('text')
          .attr('x', 500)
          .attr('y', 150)
          .attr('class', 'info-subtitle');
           var info_subtitle4 = info.append('text')
          .attr('x', 500)
          .attr('y', 175)
          .attr('class', 'info-subtitle');
           var info_subtitle5 = info.append('text')
          .attr('x', 500)
          .attr('y', 200)
          .attr('class', 'info-subtitle');
           var info_subtitle6 = info.append('text')
          .attr('x', 500)
          .attr('y', 225)
          .attr('class', 'info-subtitle');
          var info_subtitle7 = info.append('text')
          .attr('x', 500)
          .attr('y', 250)
          .attr('class', 'info-subtitle');
    var info_subtitleagainst = info.append('text')
          .attr('x', 650)
          .attr('y', 75)
          .attr('class', 'info-subtitle');
          var info_subtitleagainst1 = info.append('text')
          .attr('x', 650)
          .attr('y', 100)
          .attr('class', 'info-subtitle');
          var info_subtitleagainst2 = info.append('text')
          .attr('x', 650)
          .attr('y', 125)
          .attr('class', 'info-subtitle');
          var info_subtitleagainst3 = info.append('text')
          .attr('x', 650)
          .attr('y', 150)
          .attr('class', 'info-subtitle');
          var info_subtitleagainst4 = info.append('text')
          .attr('x', 650)
          .attr('y', 175)
          .attr('class', 'info-subtitle');
          var info_subtitleagainst5 = info.append('text')
          .attr('x', 650)
          .attr('y', 200)
          .attr('class', 'info-subtitle');
          var info_subtitleagainst6 = info.append('text')
          .attr('x', 650)
          .attr('y', 225)
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
              info_subtitle.text('Yes Camp:')
              info_subtitle1.text('50PLUS: ' + d.properties['50PLUS']);
              info_subtitle2.text('CDA: ' + d.properties['"Christen Democratisch App\u00e8l (CDA)']);
              info_subtitle3.text('D66: ' + d.properties['Democraten 66 (D66)']);
              info_subtitle4.text('GROENLINKS: ' + d.properties['GROENLINKS']);
              info_subtitle5.text('PvdA: ' + d.properties['Partij van de Arbeid (P.v.d.A.)']);
              info_subtitle6.text('VVD: ' + d.properties['VVD']);
              var totalyes = d.properties['50PLUS']+d.properties['Democraten 66 (D66)']+d.properties['GROENLINKS']+d.properties['Partij van de Arbeid (P.v.d.A.)']+d.properties['VVD'];
              info_subtitle7.text('Total: ' + totalyes);
              info_subtitleagainst.text('No Camp:');
              info_subtitleagainst1.text('ChristenUnie: ' + d.properties['ChristenUnie']);
              info_subtitleagainst2.text('PVV: ' + d.properties['PVV (Partij voor de Vrijheid)']);
              info_subtitleagainst3.text('PvdD: ' + d.properties['Partij voor de Dieren']);
              info_subtitleagainst4.text('SP: ' + d.properties['SP (Socialistische Partij)']);
              info_subtitleagainst5.text('SGP: ' + d.properties['Staatkundig Gereformeerde Partij (SGP)']);
              var totalno = d.properties['ChristenUnie']+d.properties['PVV (Partij voor de Vrijheid)']+d.properties['Partij voor de Dieren']+d.properties['Staatkundig Gereformeerde Partij (SGP)'];
              info_subtitleagainst6.text('Total: ' + totalno);

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
