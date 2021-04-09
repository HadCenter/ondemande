declare var require: any;
import { Component, OnInit, AfterViewInit } from "@angular/core";
import * as Highcharts from "highcharts/highstock";
import { KPIEvolutionNombreDeFichiersImorteParClientService } from './kpievolution-nombre-de-fichiers-imorte-par-client.service';

@Component({
  selector: 'app-kpievolution-nombre-de-fichiers-imorte-par-client',
  templateUrl: './kpievolution-nombre-de-fichiers-imorte-par-client.component.html',
  styleUrls: ['../../../theme/components/pie-chart/pie-chart.component.scss', './kpievolution-nombre-de-fichiers-imorte-par-client.component.css'],
  providers: [KPIEvolutionNombreDeFichiersImorteParClientService,],
})
export class KPIEvolutionNombreDeFichiersImorteParClientComponent implements OnInit {
  data : any [] = [];
  data2 : any [] = [];
  selected = undefined;
  show = true;
/*********************************************************************************************/
  chart;
  updateFromInput = false;
  chartCallback;
  Highcharts = Highcharts;

  ohlc = [];
  chartOptions = {

    rangeSelector: {
      buttons: [{
    type: 'month',
    count: 1,
    text: '1m',
    title: 'Voir 1 mois'
}, {
    type: 'month',
    count: 3,
    text: '3m',
    title: 'Voir 3 mois'
}, {
    type: 'month',
    count: 6,
    text: '6m',
    title: 'Voir 6 mois'
}, {
    type: 'ytd',
    text: 'YTD',
    title: 'Voir l\'année à ce jour'
}, {
    type: 'year',
    count: 1,
    text: '1a',
    title: 'Voir 1 an'
}, {
    type: 'all',
    text: 'Tous',
    title: 'Voir tout'
}],
      labelStyle: {
         display: 'none'
      },
      selected: 1,
      inputDateFormat: '%Y-%m-%d',
      inputEditDateFormat: '%Y-%m-%d'
    },
    credits: {
      enabled: false,
    },
    xAxis: {
        type: 'datetime',
        //tickInterval: 24 * 3600 * 1000, // one day
        labels:
        {
          formatter: function()
          {
            return Highcharts.dateFormat('%Y-%m-%d', this.value);
          }
        }
    },
    tooltip: {
        xDateFormat: '%Y-%m-%d',
        shared: true
    },
    series: [
      {
        name: "Nombre de fichiers",
        data: this.ohlc,

      },

    ],
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 400,
          },
          chartOptions: {
            rangeSelector: {
              inputEnabled: false
            }
          }
        }
      ]
    }
  };

  /********************************************************************************************/
  constructor(public serviceKPI : KPIEvolutionNombreDeFichiersImorteParClientService,)
  {
    const self = this;
    // saving chart reference using chart callback
    this.chartCallback = chart => {
      self.chart = chart;
    };
  }
  ngOnInit()
  {
    this.getData();  // liste des clients
    this.getData2();
     var dates_uniques = [...new Set(this.data2.map(item => item.createdAt.substring(0,10)))];
     var resultat = [];
     for (var i=0;i< dates_uniques.length; i++)
     {
       var count =0;
       this.data2.forEach(element => {
          if(element.createdAt.includes(dates_uniques[i])){count +=1}
       });
       var object = [dates_uniques[i], count]
       resultat.push(object);
     }
     for (var j=0; j< resultat.length;j++)
     {
       resultat[j][0] = Math.round(new Date(resultat[j][0]).getTime())
     }
     for (let z = 0; z < resultat.length; z += 1)
     {
        this.ohlc.push([
          resultat[z][0], // the date
          resultat[z][1], // number of files
        ]);
     }
  }
  ngAfterViewInit()
  {
    const comp = this;
  }
  /******************************liste des clients **************************************************************/
  public getData() {
    this.serviceKPI.getNumberOfFilesPerClient()
      .subscribe(res => {
        this.data = res;
        this.data = this.alphabeticalOrder(this.data);
        this.show = false;
      },
        error => console.log(error));
  }
  /**********************************************************************************************/
  public getData2() {
    this.serviceKPI.getAllFiles()
      .subscribe(res => {
        this.data2 = res.reverse();
        var dates_uniques = [...new Set(this.data2.map(item => item.createdAt.substring(0,10)))];
        var resultat = [];
        for (var i=0;i< dates_uniques.length; i++)
        {
          var count =0;
          this.data2.forEach(element => {
              if(element.createdAt.includes(dates_uniques[i])){count +=1}
          });
          var object = [dates_uniques[i], count]
          resultat.push(object);
        }
        for (var j=0; j< resultat.length;j++)
        {
          resultat[j][0] = Math.round(new Date(resultat[j][0]).getTime())
        }
          const self = this,
          chart = this.chart;
          self.chartOptions.series = [
          {
            name: "Nombre de fichiers",
            data: resultat
          },
          ];
        self.updateFromInput = true;

      },
        error => console.log(error));
  }
  /*******************************************************************************************/
   alphabeticalOrder(arr :any[] )
  {
    return arr.sort((a : any,b : any) =>{
        return a.nom_client === b.nom_client ? 0 : a.nom_client > b.nom_client ? 1 : -1;
    });
  }
  /******************************************************************************************/
  onChangeClient(ob) {
       this.selected = ob.value;
       this.onChangeClientOrDate();
  }
  /*******************************************************************************************/
//
  onChangeClientOrDate()
  {
    if(this.selected !== undefined) // select single client
    {
      var tableau = this.data.find(element => element.nom_client === this.selected).files;
      var dates_uniques = [...new Set(tableau.map(item => item.created_at.substring(0,10)))];
      var resultat = [];
      for (var i=0;i< dates_uniques.length; i++)
      {
         var count =0;
         tableau.forEach(element => {
              if(element.created_at.includes(dates_uniques[i])){count +=1}
         });
         var object = [dates_uniques[i], count]
         resultat.push(object);
      }
      for (var j=0; j< resultat.length;j++)
      {
        resultat[j][0] = Math.round(new Date(resultat[j][0]).getTime())
      }

      const self = this,
      chart = this.chart;
      self.chartOptions.series = [
        {
        name: "Nombre de fichiers",
        data: resultat
      },
      ];

      self.updateFromInput = true;
    }else //select all
    {

        var dates = [...new Set(this.data2.map(item => item.createdAt.substring(0,10)))];
        var resultat = [];
        for (var i=0;i< dates.length; i++)
        {
          var count =0;
          this.data2.forEach(element => {
              if(element.createdAt.includes(dates[i])){count +=1}
          });
          var objet = [dates[i], count]
          resultat.push(objet);
        }
        for (var j=0; j< resultat.length;j++)
        {
          resultat[j][0] = Math.round(new Date(resultat[j][0]).getTime())
        }
          const self = this,
          chart = this.chart;
          self.chartOptions.series = [
          {
            name: "Nombre de fichiers",
            data: resultat
          },
          ];

        self.updateFromInput = true;
    }
  }
}


