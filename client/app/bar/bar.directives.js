'use strict';

/**
 * Infovis directives
 */
angular.module('infovisApp')

  .directive('barChart', function() {
    return {
      restrict: 'E',
      replace: true,
      template: '<div class="bar-chart"></div>',
      link: function (scope, element, attrs) {

        var margin = {
          top: 30,
          right: 20,
          bottom: 50,
          left: 50
        };

        var width = 960 - margin.left - margin.right;
        var height = 500 - margin.top - margin.bottom;

        var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);
        var y = d3.scale.linear().range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .tickFormat(function(d) {
              var date = new Date(1, d, 1);
              return date.toLocaleDateString('en-us', {month: 'short'});
            })
            .orient('bottom');

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient('left')
            .tickFormat(function(d) { return d+' °C'; })
            .ticks(10);

        var svg = d3.select(element[0])
          .append('svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        // Initialize current selected year variable
        var selectedYear = 2015;

        // Get data from server
        d3.csv('meteo.csv', function(error, data) {
          if (error) return console.err(error);
          parseData(data);
        });

        // Parse meteo data
        scope.data = {};
        var parseData = function (data) {
          var record;
          var numDays = 0;
          var totalTemp = 0;
          var currentYear;
          var currentMonth;
          for ( var i = 0; i < data.length; i++ ) {
            record = data[i];
            if ( currentYear && parseInt(record.month) !== currentMonth ) {
              if ( !scope.data[currentYear] ) scope.data[currentYear] = [];
              scope.data[currentYear].push({
                key: currentMonth,
                value: totalTemp / numDays / 10
              });
              totalTemp = 0;
              numDays = 0;
            }
            currentYear = parseInt(record.year);
            currentMonth = parseInt(record.month);
            totalTemp += parseInt(record.temperature);
            numDays++;
          }
          scope.render();
        };

        // Render the data into the visualisation
        scope.render = function () {
          // If we don't pass any data, return out of the element
          if ( !scope.data || !scope.data[selectedYear] ) return;
          var data = scope.data[selectedYear];

          // Remove all previous items before render
          svg.selectAll('*').remove();

          x.domain(data.map(function(d) { return d.key; }));
          y.domain([0, d3.max(data, function(d) { return d.value; })]);

          // Draw x-axis
          svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0, ' + height + ')')
            .call(xAxis);

          // Draw y-axis
          svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis);

          // Add label to show bar temperature
          var label = svg.append('text')
            .attr('class', 'bar-label-hover')
            .attr('text-anchor', 'middle')
            .attr('opacity', 0);

          // Add the bars
          svg.selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', function(d) { return x(d.key); })
            .attr('width', x.rangeBand())
            .attr('y', height)
            .attr('height', 0)
            .on('mouseover', function(d) {
              label.attr('x', x(d.key) + 35);
              label.attr('y', y(d.value) + 20);
              label.text(Math.round(d.value * 100) / 100 + ' °C');
              label.transition()
                .duration(150)
                .ease('quad')
                .attr('y', y(d.value) - 10)
                .attr('opacity', 1);
            })
            .on('mouseout', function() {
              label.attr('x', -500);
              label.attr('y', -500);
              label.attr('opacity', 0);
            })
            .transition()
              .delay(function(d, i) { return i * 150; })
              .duration(150)
              .ease('quad')
              .attr('height', function(d) {
                return height - y(d.value);
              })
              .attr('y', function(d) {
                return y(d.value);
              });

          // Add labels to the bars
          svg.selectAll('.bar-label')
            .data(data)
            .enter()
            .append('text')
            .attr('class', 'bar-label')
            .attr('text-anchor', 'middle')
            .attr('opacity', 0)
            .attr('fill', '#ff4500')
            .attr('stroke', '#ff4500')
            .attr('x', function(d) { return x(d.key) + 35; })
            .attr('y', function (d) { return y(d.value) + 50; })
            .text(function (d) { return Math.round(d.value * 100) / 100 + ' °C'; })
            .transition()
              .delay(function(d, i) { return i * 150; })
              .duration(350)
              .ease('quad')
              .attr('opacity', 1)
              .attr('y', function(d) {
                return y(d.value) + 20;
              });

          // Show currently selected year
          svg.append('text')
            .attr('class', 'year-label')
            .attr('x', width-80)
            .attr('y', 0)
            .text(selectedYear);

          // Switching between the years using the arrow keys
          d3.select('body').on('keyup', function () {

            // Get array of all years used in the data
            var years = _.map(Object.keys(scope.data), function (x) { return parseInt(x); });
            var index = years.indexOf(selectedYear);

            // User navigates to the left
            if ( d3.event.keyCode === 37 ) {
              selectedYear = index === 0 ? years[years.length-1] : years[index - 1];
            }

            // User navigates to the right
            if ( d3.event.keyCode === 39 ) {
              selectedYear = index === years.length-1 ? years[0] : years[index + 1];
            }

            // Render the data again
            scope.render();
          });
        };
      }
    };
  });
