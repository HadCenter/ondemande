import { Component, ElementRef, HostBinding, OnInit } from '@angular/core';
import { KPIEvolutionNombreDeFichiersImorteParClientService } from './kpievolution-nombre-de-fichiers-imorte-par-client.service';
import * as d3 from 'd3';
import * as nv from 'nvd3';
@Component({
  selector: 'app-kpievolution-nombre-de-fichiers-imorte-par-client',
  templateUrl: './kpievolution-nombre-de-fichiers-imorte-par-client.component.html',
  styleUrls: ['../../../theme/components/pie-chart/pie-chart.component.scss'],
  providers: [KPIEvolutionNombreDeFichiersImorteParClientService],
})
export class KPIEvolutionNombreDeFichiersImorteParClientComponent implements OnInit {
  selected = '';
  data =[];
  data2 = [];
  constructor(public el: ElementRef,
    public serviceKPI : KPIEvolutionNombreDeFichiersImorteParClientService,) { }
  public getData() {
    this.serviceKPI.getNumberOfFilesPerClient()
      .subscribe(res => {
        this.data = res;
        console.log(this.data);
        this.selected = this.data[0].nom_client;
      },
        error => console.log(error));
  }
  onBookChange(ob) {
       this.selected = ob.value;
       this.data2 = [];
       var tableau = this.data.find(element => element.nom_client === this.selected).files;
       this.data2 = [...new Set(tableau.map(item => item.created_at.substring(0,10)))];
       var resultat = [];
       for (var i=0;i< this.data2.length; i++)
       {
          var count =0;
          tableau.forEach(element => {
              if(element.created_at.includes(this.data2[i])){count +=1}
          });
          var object = {
            label: this.data2[i] ,
            value: count,
          }
          resultat.push(object);
       }
        var data = [
  {
    key: "Cumulative Return",
    values: resultat
  }
];
nv.addGraph(function() {
  var chart = nv.models.discreteBarChart()
    .x(function(d) { return d.label })
    .y(function(d) { return d.value })
    .staggerLabels(true)
    .showValues(true)

  d3.select('#chart svg')
    .datum(data)
    .transition().duration(500)
    .call(chart)
    ;

  nv.utils.windowResize(chart.update);

  return chart;
});
    }
  ngOnInit(): void {
  this.getData();
    var data = [
  {
    key: "Cumulative Return",
    values: [
      {
        "label" : "15/08/2021" ,
        "value" : 29
      } ,
      {
        "label" : "16/08/2021" ,
        "value" : 0
      } ,
      {
        "label" : "17/08/2021" ,
        "value" : 32
      } ,
      {
        "label" : "18/08/2021" ,
        "value" : 196
      } ,
      {
        "label" : "19/08/2021" ,
        "value" : 50
      } ,
      {
        "label" : "20/08/2021" ,
        "value" : 98
      } ,
      {
        "label" : "21/08/2021" ,
        "value" : 13
      } ,
      {
        "label" : "22/08/2021" ,
        "value" : 5
      }
    ]
  }
];
nv.addGraph(function() {
  var chart = nv.models.discreteBarChart()
    .x(function(d) { return d.label })
    .y(function(d) { return d.value })
    .staggerLabels(true)
    .showValues(true)

  d3.select('#chart svg')
    .datum(data)
    .transition().duration(500)
    .call(chart)
    ;

  nv.utils.windowResize(chart.update);

  return chart;
});
  }

}
