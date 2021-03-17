import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { UpgradableComponent } from 'theme/components/upgradable';
import { DetailsFileEdiService } from './details-file-edi.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-details-file-edi',
  templateUrl: './details-file-edi.component.html',
  styleUrls: ['./details-file-edi.component.scss']
})
export class DetailsFileEdiComponent extends UpgradableComponent implements OnInit {
  file: any;
  data: any;
   AOA : any[][];
   headData: any;
   advancedHeaders: string[] = ['RefClient', 'Expediteur', 'Type', 'Date_livraison',"Start",'End',"Labels","Quantite","CodeArticle","Nom_destinataire","rue","ville","CP","Adresse2","CODE_interphone","Etage","Porte","Instructions","Telephone","Tel2","Tel3","email","Ref_commande","Ref2","Ref3","Code_barres","Nom_tournee","Arret"
  ];
    advancedTable = [
    {position: 'LIVINNOCENT01', name: 'INNOCENT', weight: 'delivery', symbol: '16/01/17',start:'07:30',end:'12:00'},
    {position: 'LIVINNOCENT01', name: 'INNOCENT', weight: 'delivery', symbol: '16/01/17',start:'07:30',end:'12:00'},
    {position: 'LIVINNOCENT01', name: 'INNOCENT', weight: 'delivery', symbol: '16/01/17',start:'07:30',end:'12:00'},
    {position: 'LIVINNOCENT01', name: 'INNOCENT', weight: 'delivery', symbol: '16/01/17',start:'07:30',end:'12:00'},
    {position: 'LIVINNOCENT01', name: 'INNOCENT', weight: 'delivery', symbol: '16/01/17',start:'07:30',end:'12:00'},
    {position: 'LIVINNOCENT01', name: 'INNOCENT', weight: 'delivery', symbol: '16/01/17',start:'07:30',end:'12:00'},
    {position: 'LIVINNOCENT01', name: 'INNOCENT', weight: 'delivery', symbol: '16/01/17',start:'07:30',end:'12:00'},
    {position: 'LIVINNOCENT01', name: 'INNOCENT', weight: 'delivery', symbol: '16/01/17',start:'07:30',end:'12:00'},
    {position: 'LIVINNOCENT01', name: 'INNOCENT', weight: 'delivery', symbol: '16/01/17',start:'07:30',end:'12:00'},
    {position: 'LIVINNOCENT01', name: 'INNOCENT', weight: 'delivery', symbol: '16/01/17',start:'07:30',end:'12:00'},
  ];

  constructor(private route: ActivatedRoute, private fileService: DetailsFileEdiService) {
    super();
  }

  ngOnInit(): void {
    this.getFile(this.route.snapshot.params.id);

  }

  getWrongFile() {
    // let fileName = this.file.file.substring(7)
    // fileName = decodeURI(fileName).replace('%26', '&');
      
      //  });
}

getFile(id: string): void {
  this.fileService.get(id)
    .subscribe(
      data => {
        this.file = data;
        console.log("file", this.file);
      },
      error => {
        console.log(error);
      });
}




}
