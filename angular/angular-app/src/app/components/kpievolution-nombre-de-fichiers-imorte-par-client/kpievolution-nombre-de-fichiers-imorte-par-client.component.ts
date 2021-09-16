import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { KPIEvolutionNombreDeFichiersImorteParClientService } from './kpievolution-nombre-de-fichiers-imorte-par-client.service';
import * as Highcharts from 'highcharts/highstock';

@Component({
  selector: 'app-kpievolution-nombre-de-fichiers-imorte-par-client',
  templateUrl: './kpievolution-nombre-de-fichiers-imorte-par-client.component.html',
  styleUrls: ['./kpievolution-nombre-de-fichiers-imorte-par-client.component.css'],
})
export class KPIEvolutionNombreDeFichiersImorteParClientComponent implements OnInit {
  options: any;
  chart;
  filesBydates: any = [];
  filesBydates_copy: any = [];
  FilesByFiltres: any = [];
  showLoaderFilesBydate: boolean = true;
  @Input('nameSelected') nameSelected: any;
  @Input('rangeDate') rangeDate: any;
  @Input('fileSelected') fileSelected: any;

  constructor(public fileService: KPIEvolutionNombreDeFichiersImorteParClientService) {
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
          "fileFilter":this.fileSelected
        }
        this.fileService.getNumberOfFilesWithFilters(filters).subscribe(res => {
          this.FilesByFiltres = res;
          this.getNumberOfFiles();
        })
      }

  }
  getNumberOfFiles() {
    var mapDateToNumberOfFiles = {}
    this.FilesByFiltres.forEach(element => {
      if (!Object.keys(mapDateToNumberOfFiles).includes(element.date)) {
        mapDateToNumberOfFiles[element.date] = 0;
      }
      mapDateToNumberOfFiles[element.date] += 1;
    });
    var mapDateToNumberOfFilestoArray = Object.keys(mapDateToNumberOfFiles).map((key) => [key, mapDateToNumberOfFiles[key]]);
    mapDateToNumberOfFilestoArray.forEach(el => {
      el[0] = (new Date(el[0]+" GMT")).getTime();
    })
    this.filesBydates = mapDateToNumberOfFilestoArray;
    this.redrawChartNbInterventionsParDate();
  }
  redrawChartNbInterventionsParDate() {
    this.chart.series[0].update({
      data: this.filesBydates
    }, true); //
  }
  ngOnInit(): void {
    this.getNumberOfFilesPerDateAll();
  }
  getNumberOfFilesPerDateAll() {
    this.fileService.getNumberOfFilesPerDateAll().subscribe(res => {
      const nbrFilesByDate = res;
      Object.keys(nbrFilesByDate);
      Object.values(nbrFilesByDate);
      this.filesBydates = Object.entries(nbrFilesByDate);
      this.filesBydates.forEach(element => {
        element[0] = (new Date(element[0]+" GMT")).getTime();
        this.filesBydates_copy = [...this.filesBydates];
      });
      this.loadChart();
    })
  }
  loadChart() {
    this.options.series = [
      {
        name: "Nb fichier",
        data: this.filesBydates,
        color: 'rgb(0, 188, 212)',
      },
    ]
    this.chart = Highcharts.stockChart('container-evolutions-by-date', this.options);
    this.showLoaderFilesBydate = false;
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
          text: "Nb fichier",
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

