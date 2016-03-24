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
        var marginOverview = {
          top: 430,
          right: margin.right,
          bottom: 20,
          left: margin.left
        };
        var heightOverview = 500 - marginOverview.top - marginOverview.bottom;

        // mathematical scales for the x and y axes
        var x = d3.scale.category10();
        var y = d3.scale.linear().range([height, 0]);
        var xOverview = d3.scale.linear().range([0, width]);
        var yOverview = d3.scale.linear().range([heightOverview, 0]);

        // rendering for the x and y axes
        var xAxis = d3.svg.axis()
          .scale(x)
          .orient('bottom');
        var yAxis = d3.svg.axis()
          .scale(y)
          .orient('left');
        var xAxisOverview = d3.svg.axis()
          .scale(xOverview)
          .orient('bottom');

        var svg = d3.select(element[0])
          .append('svg')
          .attr('preserveAspectRatio', 'xMinYMin meet')
          .attr('viewBox', '0 0 960 500')
          .attr('class', 'svg');

        var main = svg.append('g')
          .attr('class', 'main')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
        var overview = svg.append('g')
          .attr('class', 'overview')
          .attr('transform', 'translate(' + marginOverview.left + ',' + marginOverview.top + ')');

        // brush tool to let us zoom and pan using the overview chart
        var brush = d3.svg.brush()
          .x(xOverview)
          .on('brush', brushed);

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
          x.domain(0,d3.extent(data, function(d){ return d.url;}));
          y.domain([0, d3.max(data, function(d) { return d.count; })]);
          xOverview.domain(x.domain());
          yOverview.domain(y.domain());

          // draw the axes now that they are fully set up
          main.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis);
          main.append('g')
            .attr('class', 'y axis')
            .call(yAxis);
          overview.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + heightOverview + ')')
            .call(xAxisOverview);

          // draw the bars
          main.append('g')
            .attr('class', 'bars')
            // a group for each stack of bars, positioned in the correct x position
            .selectAll('.bar')
            .data(data)
            .enter().append('rect')
              .attr('class', 'bar')
              .attr('width', 25)
              .attr('x', function(d) { return x(d.url)+1; })
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

          overview.append('g')
            .attr('class', 'bars')
            .selectAll('.bar')
            .data(data)
            .enter().append('rect')
              .attr('class', 'bar')
              .attr('x', function(d) { return xOverview(d.url)+1; })
              .attr('width', 25)
              .attr('y', function(d) { return yOverview(d.total)-1; })
              .attr('height', function(d) { return heightOverview - yOverview(d.count); });

          // add the brush target area on the overview chart
          overview.append('g')
            .attr('class', 'x brush')
            .call(brush)
            .selectAll('rect')
              // -6 is magic number to offset positions for styling/interaction to feel right
              .attr('y', -6)
              // need to manually set the height because the brush has
              // no y scale, i.e. we should see the extent being marked
              // over the full height of the overview chart
              .attr('height', heightOverview + 7);  // +7 is magic number for styling
        };

        // zooming/panning behaviour for overview chart
        function brushed() {
          // update the main chart's x axis data range
          // x.domain(brush.empty() ? xOverview.domain() : brush.extent());

          // redraw the bars on the main chart
          main.selectAll('.bar').attr('transform', function(d) { return 'translate(' + x(d.url)+1 + ',0)'; });

          // redraw the x axis of the main chart
          main.select('.x.axis').call(xAxis);
        }
      }
    };
  });
