import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { KpiInterventionAdminService } from './kpi-intervention-admin.service';
import * as Highcharts from 'highcharts/highstock';

@Component({
  selector: 'app-kpi-intervention-admin',
  templateUrl: './kpi-intervention-admin.component.html',
  styleUrls: ['./kpi-intervention-admin.component.css']
})
export class KpiInterventionAdminComponent implements OnInit {
  options: any;
  chart;
  interventionsBydates: any = [];
  interventionsBydates_copy: any = [];
  InterventionsByFiltres: any = [];
  showLoaderInterventionBydate: boolean = true;
  @Input('nameSelected') nameSelected: any;
  @Input('rangeDate') rangeDate: any;
  @Input('fileSelected') fileSelected: any;

  constructor(public interventionService: KpiInterventionAdminService) {
    this.initChart();

  }
  ngOnChanges(changes: SimpleChanges) {
    const isFirstChange = Object.values(changes).some(c => c.isFirstChange());
    if (isFirstChange == false) {
      // if ((this.rangeDate?.startDate != null || this.rangeDate?.endDate != null) ||
      //   (this.nameSelected?.length > 0 && this.nameSelected != null)) {
        var filters = {
          "dateFilter": this.rangeDate,
          "clientFilter": this.nameSelected,
          "fileFilter": this.fileSelected
        }
        this.interventionService.getNumberOfInterventionsWithFilters(filters).subscribe(res => {
          this.InterventionsByFiltres = res;
          this.getNumberOfInterventions();
        })
      }
      // }else{
      //   this.InterventionsByFiltres = [];
      //   this.interventionService.getNumberOfInterventionsPerDateAll().subscribe(res => {
      //     const nbrInterventionsByDate = res;
      //     console.log("nbrInterventionsByDate ngOnchanges",res);
      //     Object.keys(nbrInterventionsByDate);
      //     Object.values(nbrInterventionsByDate);
      //     this.interventionsBydates = Object.entries(nbrInterventionsByDate);
      //     this.interventionsBydates.forEach(element => {
      //       element[0] = (new Date(element[0])).getTime();
      //       this.interventionsBydates_copy = [...this.interventionsBydates];
      //     });
      //     this.redrawChartNbInterventionsParDate();
      //   })
      // }
    // }
  }
  getNumberOfInterventions() {
    var mapDateToNumberOfInterventions = {}
    this.InterventionsByFiltres.forEach(element => {
      if (!Object.keys(mapDateToNumberOfInterventions).includes(element.date)) {
        mapDateToNumberOfInterventions[element.date] = 0;
      }
      mapDateToNumberOfInterventions[element.date] += 1;
    });
    var mapDateToNumberOfInterventionstoArray = Object.keys(mapDateToNumberOfInterventions).map((key) => [key, mapDateToNumberOfInterventions[key]]);
    mapDateToNumberOfInterventionstoArray.forEach(el => {
      el[0] = (new Date(el[0]+" GMT")).getTime();
    })
    this.interventionsBydates = mapDateToNumberOfInterventionstoArray;
    this.redrawChartNbInterventionsParDate();
  }
  redrawChartNbInterventionsParDate() {
    this.chart.series[0].update({
      data: this.interventionsBydates
    }, true); //
  }
  ngOnInit(): void {
    this.getNumberOfInterventionsPerDateAll();
  }
  getNumberOfInterventionsPerDateAll() {
    this.interventionService.getNumberOfInterventionsPerDateAll().subscribe(res => {
      const nbrInterventionsByDate = res;
      Object.keys(nbrInterventionsByDate);
      Object.values(nbrInterventionsByDate);
      this.interventionsBydates = Object.entries(nbrInterventionsByDate);
      this.interventionsBydates.forEach(element => {
        element[0] = (new Date(element[0]+" GMT")).getTime();
        this.interventionsBydates_copy = [...this.interventionsBydates];
      });
      this.loadChart();
    })
  }
  loadChart() {
    this.options.series = [
      {
        name: "Nb intervention",
        data: this.interventionsBydates,
        color: 'rgb(0, 188, 212)',
      },
    ]
    this.chart = Highcharts.stockChart('container-interventions-by-date', this.options);
    this.showLoaderInterventionBydate = false;
  }
  initChart() {
    this.options = {
      chart: {
        spacingLeft: 2,
        spacingRight: 20,
        // zoomType: 'xy',
        backgroundColor: '#444',

      },
      xAxis: {
        minRange: 1,
        title: {
          gridLineWidth: 0,
          style: {
            color: "hsla(0,0%,100%,.5)"
          }
        },
        type: 'datetime',
        // min: Date.UTC(2015, 1, 1, 0),
        dateTimeLabelFormats: {
          day: '%d/%m/%Y',
          month: '%d/%m/%Y',
          year: '%d/%m/%Y'
        },
        endOnTick: true,
        // showFirstLabel: false,
        // showLastLabel: false,
        startOnTick: true,
        
        labels: {
          style: {
            color: "hsla(0,0%,100%,.5)"
          },
          
        },
      },
      yAxis: [{ // Primary yAxis
        labels: {
          style: {
            color: "hsla(0,0%,100%,.5)"
          }
        },
        title: {
          text: "Nb intervention",
          gridLineWidth: 0,
          style: {
            color: "hsla(0,0%,100%,.5)"
          }
        },
       
        endOnTick: true,
        showFirstLabel: true,
        showLastLabel: true,
        startOnTick: true,
        opposite: false
      },
      ],
      tooltip: {
        shared: true,
        xDateFormat: '%e-%m-%Y',
        //xDateFormat: '%Y-%m-%d, %H:%m:%S',
        valueDecimals: 2,
        positioner: function () {
          return { x: 20, y: 20 };
        },
        shadow: false,
        borderWidth: 0,
        backgroundColor: 'rgba(255,255,255,0.8)'
      },
      navigator: {
        enabled: true,
        adaptToUpdatedData: true,   /**navigator update xx */
        series: {
          lineWidth: 0
        }
      },
      scrollbar: { enabled: false },
      rangeSelector: {
        enabled: false
      },
      legend: {
        enabled: true,
        align: 'center',
        //  x: 150,
        verticalAlign: 'top',
        floating: true,
        backgroundColor: 'transparent',
        itemStyle: {
          color: '#A0A0A0'
        },
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        series: {
          // stacking: 'normal',
          //  lineWidth: 1
        }
      },
      series: [
      ],

    }
  }

}
