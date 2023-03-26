import { Component, OnInit } from '@angular/core';
import { KPIService } from './KPI.service';
import { UpgradableComponent } from 'theme/components/upgradable';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import Chart from "chart.js";


@Component({
  selector: 'app-KPI',
  templateUrl: './KPI.component.html',
  styleUrls: ['./KPI.component.scss']
})
export class KPIComponent extends UpgradableComponent implements OnInit {
  public canvas : any;
  public AllKPI: any= [];
  public datatransp: any=[];
  
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  listClients: any = [];
  listFiles: any = [];
  rangeDate: any;
  date;
  val1;
  val2;
  val3;
  val4;
  val5;
  val6;
  val7;


  constructor(public tablesService: KPIService, private router: Router,) { super(); }

  ngOnInit(): void 
  {
    ////canvas

    this.tablesService.getAllKPI().subscribe(res => 
    {
      this.AllKPI = res;
      for (var i = 0; i < res.length; i++) {
          res[i].status = "Actif";
      }
      this.date = this.AllKPI[res.length - 1]['date'];
      this.val1 = this.AllKPI[res.length - 1]['prix_HT'];
      this.val2 = this.AllKPI[res.length - 2]['prix_HT'];
      this.val3 = this.AllKPI[res.length - 3]['prix_HT'];
      this.val4 = this.AllKPI[res.length - 4]['prix_HT'];
      this.val5 = this.AllKPI[res.length - 5]['prix_HT'];
      this.val6 = this.AllKPI[res.length - 6]['prix_HT'];
      this.val6 = this.AllKPI[res.length - 7]['prix_HT'];

      this.datatransp=[ this.val7, this.val6, this.val5, this.val4, this.val3,this.val2, this.val1];
      
      
      var speedCanvas = document.getElementById("speedChart");
      var dataFirst = 
      {
        data: this.datatransp,
        //data: [0, 19, 15, 20, 30, 40, 40, 50, 25, 30, 50, 70],
        fill: false,
        borderColor: '#fbc658',
        backgroundColor: 'transparent',
        pointBorderColor: '#fbc658',
        pointRadius: 4,
        pointHoverRadius: 4,
        pointBorderWidth: 8,
      };

      var dataSecond = {
        //data: [0, 5, 10, 12, 20, 27, 30, 34, 42, 45, 55, 63],
        data: [],
        fill: false,
        borderColor: '#51CACF',
        backgroundColor: 'transparent',
        pointBorderColor: '#51CACF',
        pointRadius: 4,
        pointHoverRadius: 4,
        pointBorderWidth: 8
      };

      var speedData = {
        //labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "dim"],
        datasets: [dataFirst, dataSecond]
      };

      var chartOptions = {
        legend: {
          display: false,
          position: 'top'
        }
      };

      var lineChart = new Chart(speedCanvas, {
        type: 'line',
        hover: false,
        data: speedData,
        options: chartOptions
      });



    ////canvas

    this.canvas = document.getElementById("chartHours");
  
      
    });  

    //this.datatransp=[ this.AllKPI[0]['prix_HT'], this.AllKPI[1]['prix_HT'] ];
    }

  listenToWebSocket(){
    this.tablesService.messages.subscribe(msg => {
     if (JSON.parse(msg).Running_Jobs && JSON.parse(msg).Running_Jobs.length > 0 ){
        localStorage.setItem('ws', JSON.stringify(JSON.parse(msg)));
      }
    });
  }
 
  getDate() {
    var start_date: any;
    var end_date: any;
    if (this.range.value.start) {
      start_date = this.toJSONLocal(this.range.value.start);
    }
    else {
      start_date = null;
    }
    if (this.range.value.end) {
      end_date = this.toJSONLocalEndDate(this.range.value.end);
    }
    else {
      end_date = null;
    }
    this.rangeDate = {
      'startDate': start_date,
      'endDate': end_date
    }
  }
  // convertir les dates en une chaîne de date conviviale MySQL
  toJSONLocal(date) {
    var local = new Date(date);
    local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
    return (local.toJSON().replace("T", " ")).slice(0, 19);
  }

  toJSONLocalEndDate(date){
    var local = new Date(date);
    local.setHours(local.getHours() + 23.59)
    local.setMinutes((local.getMinutes() - local.getTimezoneOffset())+59);
    local.setSeconds(local.getSeconds() + 59)
    return (local.toJSON().replace("T", " ")).slice(0, 19);
  }



  ///canvasss



  ///canvasss

}



