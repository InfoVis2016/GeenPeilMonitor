'use strict';

/* globals d3, colorbrewer */

/**
 * Infovis directives
 */
angular.module('infovisApp')

  .directive('wordCloud', function() {
    return {
      restrict: 'E',
      replace: true,
      template: '<div class="cloud"></div>',
      link: function (scope, element) {

        var colors = d3.scale.category20();
        var width = 960;
        var height = 500;

        function draw(words) {
          d3.select(element[0])
            .append('svg')
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', '0 0 960 500')
            .attr('class', 'svg')
            .append('g')
              .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
            .selectAll('text')
              .data(words)
            .enter().append('text')
              .style('font-size', function(d) { return d.size + 'px'; })
              .style('font-family', 'Impact')
              .style('fill', function(d, i) { return colors(i); })
              .attr('text-anchor', 'middle')
              .attr('transform', function(d) {
                return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')';
              })
              .text(function(d) { return d.text; });
        }

        


        // Get data from server
        d3.json('words.json', function(error, data) {
          if (error) { throw error; }
          
          var sizeScale = d3.scale.linear()
                    .domain([0, d3.max(data, function(d) { 
                    	return d.size; })])
                    .range([0, width / 1.5]);

          var layout = d3.layout.cloud()
          	.size([width, height])
          	.padding(5)
          	.rotate(function() {
            	return ~~(Math.random() * 2) * 90;
          	})
          	.font('Impact')
          	.fontSize(function(d) {
            	return sizeScale(d.size);
          	})
          	.on('end', draw);        
          layout.words(data);
          layout.start();
        });
        

        
      }
    };
  });