import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { KpiAnomaliesService } from './kpi-anomalies.service';
import * as Highcharts from 'highcharts/highstock';
import exportingInit from 'highcharts/modules/exporting';
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

  @Input('typeAnomaliesSelected') typeAnomaliesSelected: any;
  @Input('fileSelected') fileSelected: any;
  @Input('nameSelected') nameSelected: any;
  @Input('rangeDate') rangeDate: any;
 


  constructor(public anomalieService: KpiAnomaliesService) {
    this.initChart();
    this.initChart_nbAnomaliesByType();
  }

  ngOnChanges(changes: SimpleChanges) {
    const isFirstChange = Object.values(changes).some(c => c.isFirstChange());

    if (isFirstChange == false) {
      if ((this.typeAnomaliesSelected?.length > 0 && this.typeAnomaliesSelected != null) || (this.rangeDate?.startDate != null || this.rangeDate?.endDate != null) ||
        (this.nameSelected?.length > 0 && this.nameSelected != null) || (this.fileSelected?.length > 0 && this.fileSelected != null)) {
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
      else {
        this.anomaliesByFiltres = [];
        // this.anomaliesBydates=[...this.anomaliesBydates_copy];
        this.anomalieService.getNumberOfAnomaliesPerDateAll().subscribe(res => {
          const nbrAnomaliesByDate = res;
          Object.keys(nbrAnomaliesByDate);
          Object.values(nbrAnomaliesByDate);
          this.anomaliesBydates = Object.entries(nbrAnomaliesByDate);

          
          this.anomaliesBydates.forEach(element => {
            //   var date = new Date(element[0]);
            element[0] = (new Date(element[0])).getTime();
            //   element[0] = xAxisDate;
            this.anomaliesBydates_copy = [...this.anomaliesBydates];
           
          });
          this.redrawChartNbAnomalieParDate();
        })
       
        this.anomalieService.getNumberOfAnomaliesPerIdAll().subscribe(res => {
          const nbrAnomaliesByType = res;
          this.typesAnomalies = Object.keys(nbrAnomaliesByType);
    
          this.nbAnomaliesByTypes = Object.values(nbrAnomaliesByType);
    
          this.redrawChartNbAnomalieParType();
        })
       // this.getNumberOfAnomaliesPerType();
        // this.getNumberOfAnomaliesPerDateAll

      }


    }


  }
  ngOnInit(): void {

    this.getNumberOfAnomaliesPerDateAll();
    this.getNumberOfAnomaliesPerType();
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
    // if (this.anomaliesByFiltres.length == 0) { 
    this.anomalieService.getNumberOfAnomaliesPerDateAll().subscribe(res => {
      const nbrAnomaliesByDate = res;
      Object.keys(nbrAnomaliesByDate);
      Object.values(nbrAnomaliesByDate);
      this.anomaliesBydates = Object.entries(nbrAnomaliesByDate);
      this.anomaliesBydates.forEach(element => {
        //   var date = new Date(element[0]);
        element[0] = (new Date(element[0])).getTime();
        //   element[0] = xAxisDate;
        this.anomaliesBydates_copy = [...this.anomaliesBydates];
        this.loadChart();
      });
    })
    // }
    // else {
    //   var mapDateToNumberOfAnomaliestoArray = Object.keys(this.anomaliesByFiltres.mapDateToNumberOfAnomalies).map((key) => [key, this.anomaliesByFiltres.mapDateToNumberOfAnomalies[key]]);
    //   var mapDateToNumberOfAnomaliesParTypetoArray = Object.keys(this.anomaliesByFiltres.mapIdToNumberOfAnomalies).map((key) => [key, this.anomaliesByFiltres.mapIdToNumberOfAnomalies[key]]);
    //   this.typesAnomalies = Object.keys(mapDateToNumberOfAnomaliesParTypetoArray);

    //   this.nbAnomaliesByTypes = Object.values(mapDateToNumberOfAnomaliesParTypetoArray);
    //   mapDateToNumberOfAnomaliestoArray.forEach(el => {
    //     el[0] = (new Date(el[0])).getTime();
    //   })
    //   this.anomaliesBydates=mapDateToNumberOfAnomaliestoArray;
    //   this.redrawChartNbAnomalieParDate();
    //   this.redrawChartNbAnomalieParType();

    // }

  }

  redrawChartNbAnomalieParDate() {
    this.chart.series[0].update({
      data: this.anomaliesBydates
    }, true); //
  }

  redrawChartNbAnomalieParType() {
    this.chartnbAnomaliesByType.xAxis[0].update({categories: this.typesAnomalies});
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

    this.options = {
      // time:{
      //   timezone :"Asia/Shanghai"
      // },
      // lang: {
      //   viewFullscreen: this.translate.instant("viewFullscreen"),
      //   downloadPNG: this.translate.instant("downloadPNG"),
      //   downloadJPEG: this.translate.instant("downloadJPEG"),
      //   downloadPDF: this.translate.instant("downloadPDF"),
      //   exitFullscreen: this.translate.instant("exitFullscreen"),
      // },
      // lang: {

      //   months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
      //   weekdays: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
      //   shortMonths: ['Janv', 'Févr', 'Mars', 'Avr', 'Mai', 'Juin', 'Juill', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'],
      //   // resetZoom: "Reset",
      //   // resetZoomTitle: "Reset,
      //   // thousandsSep: ".",
      //   // decimalPoint: ','
      //   },
      exporting: {
        buttons: {
          contextButton: {
            menuItems: ['viewFullscreen', 'downloadPNG', 'downloadJPEG', 'downloadPDF']
          }
        },
        enabled: true,
      },
      chart: {
        spacingLeft: 2,
        spacingRight: 20,
        // zoomType: 'xy',
        backgroundColor: '#444',

      },



      xAxis: {
        title: {
          //  text: "Date",
          gridLineWidth: 0,
          style: {
            color: "hsla(0,0%,100%,.5)"
          }
        },
        type: 'datetime',
        // min: Date.UTC(2015, 1, 1, 0),
        dateTimeLabelFormats: {
          day: '%Y/%m/%d',
          month: '%Y/%m/%d',
          year: '%Y/%m/%d'
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
        // events: {
        //   setExtremes: function(event) {

        //     if (!event.min && !event.max) {
        //       zoomButton.destroy();
        //     }
        //   }
        // }
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
        xDateFormat: '%e-%m-%Y %H:%M:%S',
        //xDateFormat: '%Y-%m-%d, %H:%m:%S',
        valueDecimals: 2,
        positioner: function () {
          return { x: 20, y: 20 };
        },
        shadow: false,
        borderWidth: 0,
        backgroundColor: 'rgba(255,255,255,0.8)'
      },
      // navigator: {
      //   enabled: true,
      // },
      navigator: {
        enabled: true,
        adaptToUpdatedData: false,   /**navigator update xx */
        series: {

          lineWidth: 0
        }
      },
      // navigation: {
      //   buttonOptions: {
      //     align: 'center',
      //     verticalAlign: 'top',
      //     y: 20
      //   }
      // },
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
          // fontSize:'35px',
          // font: '35pt Trebuchet MS, Verdana, sans-serif',
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

  }
  initChart_nbAnomaliesByType() {
    this.options_type = {
      exporting: {
        buttons: {
          contextButton: {
            menuItems: ['viewFullscreen', 'downloadPNG', 'downloadJPEG', 'downloadPDF']
          }
        }
      },

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
        //   width: 500,
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

    // this.allAnomalies.forEach(element => {
    //   if (this.list_anomalies_names.indexOf(element.anomalie_name) === -1)
    //     this.list_anomalies_names.push(element.anomalie_name)
    // });

    this.options_type.xAxis.categories= this.typesAnomalies;
    this.options_type.series = [{
      name: "Nb anomalie",
      data: this.nbAnomaliesByTypes,  /****nbre par type */
      color: 'rgb(0, 188, 212)'
    }]

    this.chartnbAnomaliesByType = Highcharts.chart('container-options-anomalies-by-type', this.options_type);
  }

}


