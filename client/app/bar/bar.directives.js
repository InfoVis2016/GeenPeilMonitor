'use strict';

/* globals d3 */

/**
 * Infovis directives
 */
angular.module('infovisApp')

  .directive('barChart', function() {
    return {
      restrict: 'E',
      replace: true,
      template: '<div id="bar" class="bar-chart"></div>',
      link: function (scope, element) {

        var monthNames = [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December'
        ];

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
        var x = d3.time.scale().range([0, width]);
        var y = d3.scale.linear().range([height, 0]);
        var xOverview = d3.time.scale().range([0, width]);
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

        scope.svg = d3.select(element[0])
          .append('svg')
          .attr('preserveAspectRatio', 'xMinYMin meet')
          .attr('viewBox', '0 0 960 500')
          .attr('class', 'svg');

        scope.mainBar = scope.svg.append('g')
          .attr('class', 'main')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
        var overview = scope.svg.append('g')
          .attr('class', 'overview')
          .attr('transform', 'translate(' + marginOverview.left + ',' + marginOverview.top + ')');

        // brush tool to let us zoom and pan using the overview chart
        var brush = d3.svg.brush()
          .x(xOverview)
          .on('brush', brushed);

        // Info container
        var info = scope.svg.append('g')
          .attr('opacity', 0)
          .attr('class', 'info');
        var info_title = info.append('text')
          .attr('x', 150)
          .attr('y', 20)
          .attr('class', 'info-title');
        var info_subtitle = info.append('text')
          .attr('x', 150)
          .attr('y', 45)
          .attr('class', 'info-subtitle');

        // Get data from server
        d3.json('aggregatedData.json', function(error, data) {
          if (error) { throw error; }
          scope.parseData(data);
        });

        scope.parseData = function(data) {
          var _data = [];
          var parseDate = d3.time.format('%Y-%m-%d').parse;
          for ( var date in data ) {
            if ( !data.hasOwnProperty(date) ) { return; }
            _data.push({
              date: parseDate(date),
              total: data[date].count,
              words: data[date].word_counts
            });
          }
          scope.render(_data);
        };

        scope.render = function(data) {
          // data ranges for the x and y axes
          x.domain(d3.extent(data, function(d) { return d.date; }));
          y.domain([0, d3.max(data, function(d) { return d.total; })]);
          xOverview.domain(x.domain());
          yOverview.domain(y.domain());

          // draw the axes now that they are fully set up
          scope.mainBar.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis);
          scope.mainBar.append('g')
            .attr('class', 'y axis')
            .call(yAxis);
          overview.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + heightOverview + ')')
            .call(xAxisOverview);

          // draw the bars
          scope.mainBar.append('g')
            // a group for each stack of bars, positioned in the correct x position
            .selectAll('.bar')
            .data(data)
            .enter().append('rect')
              .attr('class', 'bar')
              .attr('width', 25)
              .attr('x', function(d) { return x(d.date)+1; })
              .attr('y', function(d) { return y(d.total)-1; })
              .attr('height', function(d) { return height - y(d.total); })
              .on('mouseover', function(d) {
                var day = d.date.getDate();
                var month = monthNames[d.date.getMonth()];
                var year = d.date.getFullYear();
                info_title.text(day + ' ' + month + ' ' + year);
                info_subtitle.text('Tweet count: ' + d.total);
                info.attr('opacity', 1);
              })
              .on('mouseout', function() {
                info.attr('opacity', 0);
              });

          overview.append('g')
            .attr('class', 'bars')
            .selectAll('.bar')
            .data(data)
            .enter().append('rect')
              .attr('class', 'bar')
              .attr('x', function(d) { return xOverview(d.date)+1; })
              .attr('width', 25)
              .attr('y', function(d) { return yOverview(d.total)-1; })
              .attr('height', function(d) { return heightOverview - yOverview(d.total); });

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
          x.domain(brush.empty() ? xOverview.domain() : brush.extent());

          // redraw the bars on the main chart
          scope.mainBar.selectAll('.bar').attr('transform', function(d) { return 'translate(' + x(d.date)+1 + ',0)'; });

          // redraw the x axis of the main chart
          scope.mainBar.select('.x.axis').call(xAxis);
        }
      }
    };
  });
