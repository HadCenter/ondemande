import * as d3 from 'd3';
import * as nv from 'nvd3';

import { Component, ElementRef, HostBinding, OnInit } from '@angular/core';

import { PieChartComponent as BasePieChartComponent } from 'theme/components/pie-chart';

import { BrowserStatisticsChartService } from './browser-statistics-chart.service';

@Component({
  selector: 'app-browser-statistics-chart',
  styleUrls: ['../../../theme/components/pie-chart/pie-chart.component.scss'],
  template: `<div id="chart">
  <svg></svg>
</div>`,
  providers: [BrowserStatisticsChartService],
})
export class BrowserStatisticsChartComponent implements OnInit {
  constructor(
    public el: ElementRef,
    public browserStatisticsChartService: BrowserStatisticsChartService,
  ) {

  }

  public ngOnInit() {
  this.browserStatisticsChartService.getNumberOfFilesPerClient()
      .subscribe(res => {
        var data = res;
        var h = 600;
    var r = h/2;
    var arc = d3.svg.arc().outerRadius(r);
    const COLORS = {
      red: '#f44336',
      lightBlue: '#03a9f4',
      orange: '#ffc107',
      amber: '#ff9800',
      teal: '#00bcd4',
      purple: '#7726d3',
      green: '#00d45a',
      rowBgColor: '#4a4a4a',
    };

//     var data = [
//       {"label":"Colorectale levermetastase (n=336)", "value":1},
//       {"label":"Levensmetatase van andere origine (n=32)", "value":4},
//       {"label":"Beningne levertumor (n=34)", "value":3},
//       {"label": "Primaire maligne levertumor (n=56)", "value":2},
//       {"label":"Colorecta (n=336)", "value":5},
//       {"label":"Colorecta ", "value":3},
//       {"label":"ahmed ", "value":6},
//       {"label":"safa ", "value":6},
//     ];


    var colors = [
        COLORS.purple,
        COLORS.red,
        COLORS.orange,
        COLORS.teal,
        COLORS.lightBlue,
      ];


nv.addGraph(function() {
    var chart = nv.models.pieChart()
        .x(function(d) { return d.label })
        .y(function(d) { return d.value })
        .color(colors)
        .showLabels(true)
        .labelThreshold(.05)
        .labelType("value")
        .donut(true).donutRatio(0) /* Trick to make the labels go inside the chart*/
    ;
    d3.select("#chart svg")
        .datum(data)
        .transition().duration(1200)
        .call(chart)
    ;
    d3.selectAll(".nv-label text")
        /* Alter SVG attribute (not CSS attributes) */
        .attr("transform", function(d){
            d.innerRadius = -250;
            d.outerRadius = r;
            return "translate(" + arc.centroid(d) + ")";}
        )
        .attr("text-anchor", "middle")
        /* Alter CSS attributes */
        .style({"font-size": "1em"})
    ;

    /* Replace bullets with blocks */
    d3.selectAll('.nv-series').each(function(d,i) {
        var group = d3.select(this),
            circle = group.select('circle');
        var color = circle.style('fill');
        circle.remove();
        var symbol = group.append('path')
            .attr('d', d3.svg.symbol().type('square'))
            .style('stroke', color)
            .style('fill', color)
            // ADJUST SIZE AND POSITION
            .attr('transform', 'scale(1.5) translate(-2,0)')
    });
      return chart;
    });

      },
        error => console.log(error));


    }

}
