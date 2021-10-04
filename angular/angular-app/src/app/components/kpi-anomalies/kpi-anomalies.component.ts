import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { KpiAnomaliesService } from './kpi-anomalies.service';
import * as Highcharts from 'highcharts/highstock';
@Component({
  selector: 'app-kpi-anomalies',
  templateUrl: './kpi-anomalies.component.html',
  styleUrls: ['./kpi-anomalies.component.css'],
})
export class KpiAnomaliesComponent implements OnInit {
  allAnomalies: any = [];
  options: any;
  options_type: any;
  chart;
  chartnbAnomaliesByType;
  nbrAnomaliesByDate: any = [];
  list_anomalies_names: any = [];
  anomaliesBydates: any = [];
  anomaliesBydates_copy: any = [];
  uniqueAnomalies: any = [];
  anomaliesByTypes: any = [];
  nbAnomaliesByTypes: any = [];
  typesAnomalies: any = [];
  anomaliesByFiltres: any = [];
  showChartAnomaliesByDates: boolean = true;
  showChartAnomaliesByType: boolean = true;
  currentTimeZoneOffsetInHours=0;

  @Input('typeAnomaliesSelected') typeAnomaliesSelected: any;
  @Input('fileSelected') fileSelected: any;
  @Input('nameSelected') nameSelected: any;
  @Input('rangeDate') rangeDate: any;

  constructor(public anomalieService: KpiAnomaliesService) {
    this.initChart();
    this.initChart_nbAnomaliesByType();
    this.anomaliesByFiltres = [];
    
  }
  ngOnInit(): void {
    this.getNumberOfAnomaliesPerDateAll();
    this.getNumberOfAnomaliesPerType();
  }

  ngOnChanges(changes: SimpleChanges) {
    const isFirstChange = Object.values(changes).some(c => c.isFirstChange());
    if (isFirstChange == false) {
    //  if ((this.typeAnomaliesSelected?.length > 0 && this.typeAnomaliesSelected != null) || (this.rangeDate?.startDate != null || this.rangeDate?.endDate != null) ||
     //   (this.nameSelected?.length > 0 && this.nameSelected != null) || (this.fileSelected?.length > 0 && this.fileSelected != null)) {
        var filters = {
          "dateFilter": this.rangeDate,
          "clientFilter": this.nameSelected,
          "anomalieFilter": this.typeAnomaliesSelected,
          "fileFilter": this.fileSelected,
        }
        this.anomalieService.getNumberOfAnomaliesWithFilters(filters).subscribe(res => {
          this.anomaliesByFiltres = res;
          this.getNumberOfAnomalies();

        })
      }
 //   }

  }

  getNumberOfAnomalies() {
    var mapDateToNumberOfAnomaliestoArray = Object.keys(this.anomaliesByFiltres.mapDateToNumberOfAnomalies).map((key) => [key, this.anomaliesByFiltres.mapDateToNumberOfAnomalies[key]]);
    var mapDateToNumberOfAnomaliesParTypetoArray = Object.keys(this.anomaliesByFiltres.mapIdToNumberOfAnomalies).map((key) => [key, this.anomaliesByFiltres.mapIdToNumberOfAnomalies[key]]);
    this.typesAnomalies = Object.keys(this.anomaliesByFiltres.mapIdToNumberOfAnomalies);
    this.nbAnomaliesByTypes = Object.values(mapDateToNumberOfAnomaliesParTypetoArray);
    mapDateToNumberOfAnomaliestoArray.forEach(el => {
      el[0] = (new Date(el[0])).getTime();
    })
    this.anomaliesBydates = mapDateToNumberOfAnomaliestoArray;
    this.redrawChartNbAnomalieParDate();
    this.redrawChartNbAnomalieParType();
  }

  getNumberOfAnomaliesPerDateAll() {
    this.anomalieService.getNumberOfAnomaliesPerDateAll().subscribe(res => {
      const nbrAnomaliesByDate = res;
      Object.keys(nbrAnomaliesByDate);
      Object.values(nbrAnomaliesByDate);
      this.anomaliesBydates = Object.entries(nbrAnomaliesByDate);
      this.anomaliesBydates.forEach(element => {
        element[0] = (new Date(element[0])).getTime();
        this.anomaliesBydates_copy = [...this.anomaliesBydates];

      });
       this.loadChart();
    })
  }

  redrawChartNbAnomalieParDate() {
    this.chart.series[0].update({
      data: this.anomaliesBydates
    }, true); //
  }

  redrawChartNbAnomalieParType() {
    this.chartnbAnomaliesByType.xAxis[0].update({ categories: this.typesAnomalies });
    this.chartnbAnomaliesByType.series[0].update({
      data: this.nbAnomaliesByTypes
    }, true); //
  }

  getNumberOfAnomaliesPerType() {
    this.anomalieService.getNumberOfAnomaliesPerIdAll().subscribe(res => {
      const nbrAnomaliesByType = res;
      this.typesAnomalies = Object.keys(nbrAnomaliesByType);
      this.nbAnomaliesByTypes = Object.values(nbrAnomaliesByType);
      this.loadChart_nbAnomaliesByType();
    })
  }

  initChart() {
var x = new Date();
//var currentTimeZoneOffsetInHours = ((x.getTimezoneOffset() / 60))+((x.getTimezoneOffset() / 60));
var currentTimeZoneOffsetInHours = ((x.getTimezoneOffset() / 60));
    
this.options = {
    //   global: {
    //     timezoneOffset: -2
    // },
      chart: {
        spacingLeft: 2,
        spacingRight: 20,
        // zoomType: 'xy',
        backgroundColor: '#444',

      },
      time: {
      // useUTC: false,
     timezoneOffset: currentTimeZoneOffsetInHours * 60

      },
      xAxis: {
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
          text: "Nb anomalie",
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
        adaptToUpdatedData: false,   /**navigator update xx */
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

  loadChart() {
    this.options.series = [
      {
        name: "Nb anomalie",
        data: this.anomaliesBydates,
        color: 'rgb(0, 188, 212)',
      },
    ]
    this.chart = Highcharts.stockChart('container-anomalies-by-date', this.options);
    this.showChartAnomaliesByDates = false;
  }

  initChart_nbAnomaliesByType() {
    this.options_type = {
      chart: {
        type: 'bar',
        backgroundColor: '#444',
        // zoomType: 'xy',
        resetZoomButton: {
          position: {
            align: 'right', // right by default
            verticalAlign: 'top',
            x: -50,
            y: 10
          },
          relativeTo: 'chart'
        },
        spacingLeft: 2,
        spacingRight: 20,
      },
      title: {
        text: "Nb anomalie",
        style: {
          color: "hsla(0,0%,100%,.5)"
        }
      },
      tooltip: {
        shared: true,
        valueDecimals: 0,
        positioner: function () {
          return { x: 45, y: 20 };
        },
        shadow: false,
        borderWidth: 0,
        backgroundColor: 'rgba(255,255,255,0.8)'
      },
      scrollbar: { enabled: false },
      rangeSelector: {
        enabled: false
      },
      navigator: {
        enabled: false,

      },
      credits: {
        enabled: false
      },

      xAxis: {
        categories: [],
        labels: {
          style: {
            color: "hsla(0,0%,100%,.5)"
          },
        },
      },
      yAxis: {
        //min: 0,
        labels: {
          style: {
            color: "hsla(0,0%,100%,.5)"
          }
        },
        title: {
          text: undefined,
          style: {
            color: "hsla(0,0%,100%,.5)"
          }
        }
      },

      plotOptions: {
        series: {
          stacking: 'normal'
        }
      },
      legend: {
        enabled: false
      },
      series: []
    }
  }

  loadChart_nbAnomaliesByType(): any {
    this.options_type.xAxis.categories = this.typesAnomalies;
    this.options_type.series = [{
      name: "Nb anomalie",
      data: this.nbAnomaliesByTypes,  /****nbre par type */
      color: 'rgb(0, 188, 212)'
    }]

    this.chartnbAnomaliesByType = Highcharts.chart('container-options-anomalies-by-type', this.options_type);
    this.chartnbAnomaliesByType.xAxis[0].update({ categories: this.typesAnomalies });
    this.showChartAnomaliesByType = false;
  }

}


