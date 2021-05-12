import { Component, Input, OnInit, SimpleChanges} from '@angular/core';

import { KPInombreDeFichiersImorteParClientService } from './kpinombre-de-fichiers-imorte-par-client.service';

@Component({
  selector: 'app-kpinombre-de-fichiers-imorte-par-client',
  templateUrl: './kpinombre-de-fichiers-imorte-par-client.component.html',
  styleUrls: ['./kpinombre-de-fichiers-imorte-par-client.component.css']
})

export class KPInombreDeFichiersImorteParClientComponent implements OnInit {
  @Input('nameSelected') nameSelected: any;
  @Input('rangeDate') rangeDate: any;
  count ;
  constructor(
    public serviceKPI : KPInombreDeFichiersImorteParClientService,) { }
  ngOnInit(): void {
    this.getNumberOfFilesPerDateAll();
  }

  getNumberOfFilesPerDateAll() {
    var filters = {
       "dateFilter": null,
       "clientFilter": null,
    }
    this.serviceKPI.getNumberOfFilesWithFilters(filters).subscribe(res => {
      this.count = res.length;
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    const isFirstChange = Object.values(changes).some(c => c.isFirstChange());
    if (isFirstChange == false) {
        var filters = {
          "dateFilter": this.rangeDate,
          "clientFilter": this.nameSelected,
        }
        this.serviceKPI.getNumberOfFilesWithFilters(filters).subscribe(res => {
          this.count = res.length;
        })
    }
    }

}
