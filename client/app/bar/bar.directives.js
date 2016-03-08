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

        // some colours to use for the bars
        var colour = d3.scale.ordinal().range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

        // mathematical scales for the x and y axes
        var x = d3.time.scale().range([0, width]);
        var y = d3.scale.linear().range([height, 0]);
        var xOverview = d3.time.scale().range([0, width]);
        var yOverview = d3.scale.linear().range([heightOverview, 0]);

        // rendering for the x and y axes
        var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");
        var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left");
        var xAxisOverview = d3.svg.axis()
          .scale(xOverview)
          .orient("bottom");

        var svg = d3.select(element[0])
          .append('svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom);

        var main = svg.append("g")
          .attr("class", "main")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        var overview = svg.append("g")
          .attr("class", "overview")
          .attr("transform", "translate(" + marginOverview.left + "," + marginOverview.top + ")");

        // brush tool to let us zoom and pan using the overview chart
        var brush = d3.svg.brush()
          .x(xOverview)
          .on("brush", brushed);

        // Get data from server
        d3.json('tweets.json', function(error, data) {
          if (error) return console.log(error);
          scope.parseData(data);
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
