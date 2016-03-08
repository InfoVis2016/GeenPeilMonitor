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

        scope.parseData = function(data) {
          var clean_data = [];
          var parseDate = d3.time.format("%d/%m/%Y").parse;
          _.each(data, function(d) {
            clean_data.push({
              date: parseDate(d.date), // turn the date string into a date object
              total: d.count
            });
          });
          scope.render(clean_data);
        }

        scope.render = function(data) {
          // data ranges for the x and y axes
          x.domain(d3.extent(data, function(d) { return d.date; }));
          y.domain([0, d3.max(data, function(d) { return d.total; })]);
          xOverview.domain(x.domain());
          yOverview.domain(y.domain());

          // data range for the bar colours
          // (essentially maps attribute names to colour values)
          colour.domain(d3.keys(data[0]));

          // draw the axes now that they are fully set up
          main.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
          main.append("g")
            .attr("class", "y axis")
            .call(yAxis);
          overview.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + heightOverview + ")")
            .call(xAxisOverview);

          // draw the bars
          main.append("g")
            .attr("class", "bars")
            // a group for each stack of bars, positioned in the correct x position
            .selectAll(".bar")
            .data(data)
            .enter().append("rect")
              .attr("class", "bar")
              .attr("width", 6)
              //.attr("transform", function(d) { return "translate(" + x(d.date) + ",0)"; })
              .attr('x', function(d) { return x(d.date); })
              .attr("y", function(d) { return y(d.total); })
              .attr("height", function(d) { return height - y(d.total); });

          overview.append("g")
            .attr("class", "bars")
            .selectAll(".bar")
            .data(data)
            .enter().append("rect")
              .attr("class", "bar")
              .attr("x", function(d) { return xOverview(d.date) - 3; })
              .attr("width", 6)
              .attr("y", function(d) { return yOverview(d.total); })
              .attr("height", function(d) { return heightOverview - yOverview(d.total); });

          // add the brush target area on the overview chart
          overview.append("g")
            .attr("class", "x brush")
            .call(brush)
            .selectAll("rect")
              // -6 is magic number to offset positions for styling/interaction to feel right
              .attr("y", -6)
              // need to manually set the height because the brush has
              // no y scale, i.e. we should see the extent being marked
              // over the full height of the overview chart
              .attr("height", heightOverview + 7);  // +7 is magic number for styling
        };

        // zooming/panning behaviour for overview chart
        function brushed() {
          // update the main chart's x axis data range
          x.domain(brush.empty() ? xOverview.domain() : brush.extent());

          // redraw the bars on the main chart
          main.selectAll(".bar").attr("transform", function(d) { return "translate(" + x(d.date) + ",0)"; })

          // redraw the x axis of the main chart
          main.select(".x.axis").call(xAxis);
        }
      }
    };
  });
