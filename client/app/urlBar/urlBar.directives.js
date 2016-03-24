'use strict';

/* globals d3 */

/**
 * Infovis directives
 */
angular.module('infovisApp')

  .directive('urlBarChart', function() {
    return {
      restrict: 'E',
      replace: true,
      template: '<div class="bar-chart"></div>',
      link: function (scope, element) {

        var margin = {
          top: 80,
          right: 20,
          bottom: 100,
          left: 50
        };
        var width = 960 - margin.left - margin.right;
        var height = 500 - margin.top - margin.bottom;

        // mathematical scales for the x and y axes
        var x = d3.scale.linear().range([0, width]);
        var y = d3.scale.linear().range([height, 0]);

        // rendering for the x and y axes
        var xAxis = d3.svg.axis()
          .scale(x)
          .orient('bottom');
        var yAxis = d3.svg.axis()
          .scale(y)
          .orient('left');

        var svg = d3.select(element[0])
          .append('svg')
          .attr('preserveAspectRatio', 'xMinYMin meet')
          .attr('viewBox', '0 0 960 500')
          .attr('class', 'svg');

        var main = svg.append('g')
          .attr('class', 'main')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        // Info container
        var info = svg.append('g')
          .attr('opacity', 0)
          .attr('class', 'info');
        var info_title = info.append('text')
          .attr('x', 50)
          .attr('y', 20)
          .attr('class', 'info-title');
        var info_subtitle = info.append('text')
          .attr('x', 50)
          .attr('y', 45)
          .text('asdfasdf')
          .attr('class', 'info-subtitle');

        // Get data from server
        d3.json('urls.json', function(error, data) {
          if (error) { throw error; }
          scope.parseData(data);
        });

        scope.parseData = function(data) {
          var _data = [];
          for ( var i in data ) {
            _data.push({
              url: data[i].url,
              count: data[i].count,
              relevantSentence: data[i].relevantSentence
            });
          }
          scope.render(_data);
        };

        scope.render = function(data) {
          // data ranges for the x and y axes
          y.domain([0, d3.max(data, function(d) { return d.count; })]);

          // draw the axes now that they are fully set up
          main.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis);
          main.append('g')
            .attr('class', 'y axis')
            .call(yAxis);

          // draw the bars
          main.append('g')
            .attr('class', 'bars')
            // a group for each stack of bars, positioned in the correct x position
            .selectAll('.bar')
            .data(data)
            .enter().append('rect')
              .attr('class', 'bar')
              .attr('width', 25)
              .attr('x', function(d, i) { return i*(25+5); })
              .attr('y', function(d) { return y(d.count)-1; })
              .attr('height', function(d) { return height - y(d.count); })
              .on('mouseover', function(d) {
                info_title.text(d.relevantSentence);
                info_subtitle.text('Tweet count: ' + d.count);
                info.attr('opacity', 1);
              })
              .on('mouseout', function() {
                info.attr('opacity', 0);
              })
              .on('click', function(d){
                window.open(d.url, '_blank');
              });
        };
      }
    };
  });
