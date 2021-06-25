import { AfterViewInit, Component, OnInit, HostListener, ViewChild, QueryList, ViewChildren, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailsTransactionService } from './details-transaction.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UpgradableComponent } from 'theme/components/upgradable';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';



@Component({
  selector: 'app-details-transaction',
  templateUrl: './details-transaction.component.html',
  styleUrls: ['./details-transaction.component.scss']
})
export class DetailsTransactionComponent extends UpgradableComponent implements OnInit{
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  fichierException: any = [];
  fichierLivraison: any = [];
  fichierMad: any = [];
  fichierMetadata: any = [];
  displayedColumnsLivraison: string[] = [ 'Date','Expediteur','Activite','Categorie','Type_de_Service','ID_de_la_tache','Item___Nom_sous_categorie','Item___Type_unite_manutention','Item___Quantite','Code_postal','sourceHubName','Round_Name'];
  displayedColumnsException: string[] = [ 'Date','Expediteur','Activite','Categorie','Type_de_Service','ID_de_la_tache','Item___Nom','Item___Type','Item___Quantite','Code_postal','Round_Name','Remarque','isDeleted'];
  displayedColumnsMetadata: string[] = [ 'Date','Expediteur','Activite','Categorie','Type_de_Service','ID_de_la_tache','Item___Nom_sous_categorie','Item___Type_unite_manutention','Item___Quantite','Code_postal','sourceHubName','Round_Name','sourceClosureDate','realInfoHasPrepared','status','metadataFACTURATION'];
  displayedColumnsMad: string[] = [ 'Date','Expediteur','Activite','Categorie','Type_de_Service','ID_de_la_tache','Item___Nom_sous_categorie','Item___Type_unite_manutention','Item___Quantite','Code_postal','sourceHubName','Round_Name'];
  dataSource = new MatTableDataSource<any>(this.fichierLivraison);
  dataSourceException = new MatTableDataSource<any>(this.fichierException);
  dataSourceMetaData = new MatTableDataSource<any>(this.fichierMetadata);
  dataSourceMAD = new MatTableDataSource<any>(this.fichierMad);
  selection: any[]=[];
  selectionEception: any[]=[];
  selectionMetadata: any[]=[];
  selectionMad: any[]=[];
  @ViewChildren("cell", { read: ElementRef }) cells: QueryList<ElementRef>;
  @ViewChildren("cellException", { read: ElementRef }) cellsException: QueryList<ElementRef>;
  @ViewChildren("cellMetadata", { read: ElementRef }) cellsMetadata: QueryList<ElementRef>;
  @ViewChildren("cellMad", { read: ElementRef }) cellsMad: QueryList<ElementRef>;
  newCellValue: string = '';
  newCellValueException: string = '';
  newCellValueMetadata: string = '';
  newCellValueMad: string = '';
  arrayLivraison: any = [];
  arrayException: any = [];
  arrayMetaData: any = [];
  arrayMad: any = [];
  showLoaderLivraisonFile = true;
  showLoaderExceptionFile = true;
  showLoaderMetadataFile = true;
  showLoaderMadFile = true;
  public snackAction = 'Ok';
  copyFilterLivraison: any = [];
  copyFilterException: any = [];
  copyFilterMetaData: any = [];
  copyFilterMad: any = [];
  fileTocheck: any;
  fileTocheckException : any;
  fileTocheckMetadata : any;
  fileTocheckMad : any;
  transaction: any;
  constructor(private route: ActivatedRoute,
    public service: DetailsTransactionService,
    private _snackBar: MatSnackBar, private router: Router,) { super(); }

  ngOnInit(): void {
    this.service.getDetailTransaction(this.route.snapshot.params.id).subscribe(res => {
      this.transaction = res;
    })
    var data = { "transaction_id": parseInt(this.route.snapshot.params.id) };
    this.service.seeAllFileTransaction(data).subscribe(res => {
      this.dataSource.paginator = this.paginator.toArray()[0];
      this.arrayLivraison = res.livraison;
      this.dataSource.data = this.arrayLivraison;
      this.dataSourceException.paginator = this.paginator.toArray()[1];
      this.arrayException = res.exception;
      this.dataSourceException.data = this.arrayException;
      this.dataSourceMetaData.paginator = this.paginator.toArray()[2];
      this.arrayMetaData = res.metadata;
      this.dataSourceMetaData.data = this.arrayMetaData;
      this.dataSourceMAD.paginator = this.paginator.toArray()[3];
      this.arrayMad = res.mad;
      this.dataSourceMAD.data = this.arrayMad;
      this.showLoaderLivraisonFile = false;
      this.showLoaderExceptionFile = false;
      this.showLoaderMetadataFile = false;
      this.showLoaderMadFile = false;
    })

  }
  indexOfInArray(item: string, array: string[]): number {
    let index: number = -1;
    for (let i = 0; i < array.length; i++) {
      if (array[i] === item) { index = i; }
    }
    return index;
  }

  select(event : MouseEvent, cell: any) {
    const cellClick = this.cells.find(x => x.nativeElement == event.target);
    
    let indexSelected = -1;
    this.cells.forEach((x, i) => {
      if (x == cellClick) indexSelected = i + this.paginator.toArray()[0].pageIndex * this.displayedColumnsLivraison.length * this.paginator.toArray()[0].pageSize;
    });
    //console.log(cellClick);
    this.selection = [indexSelected]
    //console.log("this.selection",this.selection);
  }
  selectMetadata(event : MouseEvent, cell: any) {
    const cellClick = this.cellsMetadata.find(x => x.nativeElement == event.target);
    let indexSelected = -1;
    this.cellsMetadata.forEach((x, i) => {
      if (x == cellClick) indexSelected = i + this.paginator.toArray()[2].pageIndex * this.displayedColumnsMetadata.length * this.paginator.toArray()[2].pageSize;
    });
    this.selectionMetadata = [indexSelected]
    //console.log("this.selectionMetadata",this.selectionMetadata);
  }
  selectException(event : MouseEvent, cell: any) {
    const cellClick = this.cellsException.find(x => x.nativeElement == event.target);
    let indexSelected = -1;
    this.cellsException.forEach((x, i) => {
      if (x == cellClick) indexSelected = i + this.paginator.toArray()[1].pageIndex * this.displayedColumnsException.length * this.paginator.toArray()[1].pageSize;
    });
    this.selectionEception = [indexSelected];
  }
  selectMad(event : MouseEvent, cell: any) {
    const cellClick = this.cellsMad.find(x => x.nativeElement == event.target);
    
    let indexSelected = -1;
    this.cellsMad.forEach((x, i) => {
      if (x == cellClick) indexSelected = i + this.paginator.toArray()[3].pageIndex * this.displayedColumnsMad.length * this.paginator.toArray()[3].pageSize;
    });
    //console.log(cellClick);
    this.selectionMad = [indexSelected]
    //console.log("this.selection",this.selection);
  }

  onMouseUp() {
    this.newCellValue = '';
    this.selectionEception = [];
    this.selectionMetadata = [];
    this.selectionMad = [];
  }
  onMouseUpMetadata() {
    this.newCellValueMetadata = '';
    this.selection = [];
    this.selectionEception = [];
    this.selectionMad = [];
  }
  onMouseUpException() {
    this.newCellValueException = '';
    this.selection = [];
    this.selectionMetadata = [];
    this.selectionMad = [];
  }
  onMouseUpMad() {
    this.newCellValueMad = '';
    this.selection = [];
    this.selectionEception = [];
    this.selectionMetadata = [];
  }

  isSelected(row,column)
  {
      const index=column*(this.cells.length/this.displayedColumnsLivraison.length)+row+this.paginator.toArray()[0].pageIndex * this.displayedColumnsLivraison.length * this.paginator.toArray()[0].pageSize
      return this.selection.indexOf(index)>=0
  }
  isSelectedException(row,column)
  {
    const index=column*(this.cellsException.length/this.displayedColumnsException.length)+row+this.paginator.toArray()[1].pageIndex * this.displayedColumnsException.length * this.paginator.toArray()[1].pageSize
    return this.selectionEception.indexOf(index)>=0
  }
  isSelectedMetadata(row,column)
  {
    const index=column*(this.cellsMetadata.length/this.displayedColumnsMetadata.length)+row+this.paginator.toArray()[2].pageIndex * this.displayedColumnsMetadata.length * this.paginator.toArray()[2].pageSize
    return this.selectionMetadata.indexOf(index)>=0
  }
  isSelectedMad(row,column)
  {
      const index=column*(this.cellsMad.length/this.displayedColumnsMad.length)+row+this.paginator.toArray()[3].pageIndex * this.displayedColumnsMad.length * this.paginator.toArray()[3].pageSize
      return this.selectionMad.indexOf(index)>=0
  }


    /**
  * After the user enters a new value, all selected cells must be updated
  * document:keyup
  * @param event
  */
  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent): void {
     // If no cell is selected then ignore keyUp event
     if (this.selection.length > 0)
     {
        let specialKeys: string[] = ['Enter', 'PrintScreen', 'Escape', 'cControl', 'NumLock', 'PageUp', 'PageDown', 'End',
        'Home', 'Delete', 'Insert', 'ContextMenu', 'Control', 'ControlAltGraph', 'Alt', 'Meta', 'Shift', 'CapsLock',
        'Tab', 'ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Pause', 'ScrollLock', 'Dead', '',
        'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'];
        if (event.key === 'Backspace') { // 'delete' key is pressed
            const end: number = this.newCellValue.length - 1;
            this.newCellValue = this.newCellValue.slice(0, end);
        } else if (this.indexOfInArray(event.key, specialKeys) === -1) {
            this.newCellValue += event.key;
        }
        this.updateSelectedCellsValues(this.newCellValue);
     }else{
        if (this.selectionEception.length > 0)
        {
          let specialKeys: string[] = ['Enter', 'PrintScreen', 'Escape', 'cControl', 'NumLock', 'PageUp', 'PageDown', 'End',
          'Home', 'Delete', 'Insert', 'ContextMenu', 'Control', 'ControlAltGraph', 'Alt', 'Meta', 'Shift', 'CapsLock',
          'Tab', 'ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Pause', 'ScrollLock', 'Dead', '',
          'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'];
          if (event.key === 'Backspace') { // 'delete' key is pressed
              const end: number = this.newCellValueException.length - 1;
              this.newCellValueException = this.newCellValueException.slice(0, end);
          } else if (this.indexOfInArray(event.key, specialKeys) === -1) {
              this.newCellValueException += event.key;
          }
          this.updateSelectedCellsValuesExceptions(this.newCellValueException);

        }else{
          if (this.selectionMetadata.length > 0)
          {
            let specialKeys: string[] = ['Enter', 'PrintScreen', 'Escape', 'cControl', 'NumLock', 'PageUp', 'PageDown', 'End',
            'Home', 'Delete', 'Insert', 'ContextMenu', 'Control', 'ControlAltGraph', 'Alt', 'Meta', 'Shift', 'CapsLock',
            'Tab', 'ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Pause', 'ScrollLock', 'Dead', '',
            'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'];
            if (event.key === 'Backspace') { // 'delete' key is pressed
                const end: number = this.newCellValueMetadata.length - 1;
                this.newCellValueMetadata = this.newCellValueMetadata.slice(0, end);
            } else if (this.indexOfInArray(event.key, specialKeys) === -1) {
                this.newCellValueMetadata += event.key;
            }
            this.updateSelectedCellsValuesMetadata(this.newCellValueMetadata);
          }else{
            if(this.selectionMad.length > 0)
            {
              let specialKeys: string[] = ['Enter', 'PrintScreen', 'Escape', 'cControl', 'NumLock', 'PageUp', 'PageDown', 'End',
              'Home', 'Delete', 'Insert', 'ContextMenu', 'Control', 'ControlAltGraph', 'Alt', 'Meta', 'Shift', 'CapsLock',
              'Tab', 'ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Pause', 'ScrollLock', 'Dead', '',
              'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'];
              if (event.key === 'Backspace') { // 'delete' key is pressed
                  const end: number = this.newCellValueMad.length - 1;
                  this.newCellValueMad = this.newCellValueMad.slice(0, end);
              } else if (this.indexOfInArray(event.key, specialKeys) === -1) {
                  this.newCellValueMad += event.key;
              }
              this.updateSelectedCellsValuesMad(this.newCellValueMad);
            }
          }
        }
     } 
  }
  updateSelectedCellsValues(text: string) {
    if (text == null) { return; }
    this.fichierLivraison = this.dataSource.data;
    //console.log("1-this.dataSource.data",this.dataSource.data);
    this.fichierLivraison.forEach(function(obj){
      const {Tournee,taskId,itemId, ...newObj} = obj;
      obj = newObj;
      /*delete obj.Tournee;
      delete obj.taskId;
      delete obj.itemId;*/
    });
    var tableauOfCells = [];
    //console.log("this.fichierLivraison",this.fichierLivraison);
    for (let i=0; i< this.fichierLivraison.length; i=i+this.paginator.toArray()[0].pageSize)
    {
      for(let j=0 ; j< this.displayedColumnsLivraison.length; j++)
      {
        var column = this.displayedColumnsLivraison[j];
        var finalArray = this.fichierLivraison.slice(i,i+this.paginator.toArray()[0].pageSize).map(function (obj) {
          return obj[column];
        });
        tableauOfCells = tableauOfCells.concat(finalArray);
      }
    }
    tableauOfCells[this.selection[0]] = text;
    var ArrayOfObjectsAfterUpdate = [];
    for (let i=0;i<tableauOfCells.length;i = i+this.displayedColumnsLivraison.length*this.paginator.toArray()[0].pageSize)
    {
      var tableau_slice = tableauOfCells.slice(i,i+this.displayedColumnsLivraison.length*this.paginator.toArray()[0].pageSize);
      //console.log(tableau_slice);
      var round = tableau_slice.length/this.displayedColumnsLivraison.length;
      for(let j=0;j<round;j++)
      {
        var objetTransaction = new Object();
        for(let k=0;k<this.displayedColumnsLivraison.length;k++)
        {
          objetTransaction[this.displayedColumnsLivraison[k]] = tableau_slice[j+k*round];
        }
        ArrayOfObjectsAfterUpdate.push(objetTransaction);
      }
    }
    this.dataSource.data = ArrayOfObjectsAfterUpdate;
    this.copyFilterLivraison = this.dataSource.data;
    //console.log("this.dataSource.data",this.dataSource.data);
  }
  updateSelectedCellsValuesExceptions(text: string) {
    console.log(text);
    if (text == null) { return; }
    this.fichierException = this.dataSourceException.data;
    //console.log("1-this.dataSourceException.data",this.dataSourceException.data);
    this.fichierException.forEach(function(obj){
      const {Tournee,taskId,itemId, ...newObj} = obj;
      obj = newObj;
      /*delete obj.Tournee;
      delete obj.taskId;
      delete obj.itemId;*/
    });
    var tableauOfCells = [];
    //console.log("this.fichierLivraison",this.fichierLivraison);
    for (let i=0; i< this.fichierException.length; i=i+this.paginator.toArray()[1].pageSize)
    {
      for(let j=0 ; j< this.displayedColumnsException.length; j++)
      {
        var column = this.displayedColumnsException[j];
        var finalArray = this.fichierException.slice(i,i+this.paginator.toArray()[1].pageSize).map(function (obj) {
          return obj[column];
        });
        tableauOfCells = tableauOfCells.concat(finalArray);
      }
    }
    //console.log("tableauOfCells",tableauOfCells);
    //console.log(this.selectException[0]);
    tableauOfCells[this.selectionEception[0]] = text;
    var ArrayOfObjectsAfterUpdate = [];
    for (let i=0;i<tableauOfCells.length;i = i+this.displayedColumnsException.length*this.paginator.toArray()[1].pageSize)
    {
      var tableau_slice = tableauOfCells.slice(i,i+this.displayedColumnsException.length*this.paginator.toArray()[1].pageSize);
      //console.log(tableau_slice);
      var round = tableau_slice.length/this.displayedColumnsException.length;
      for(let j=0;j<round;j++)
      {
        var objetTransaction = new Object();
        for(let k=0;k<this.displayedColumnsException.length;k++)
        {
          objetTransaction[this.displayedColumnsException[k]] = tableau_slice[j+k*round];
        }
        ArrayOfObjectsAfterUpdate.push(objetTransaction);
      }
    }
    this.dataSourceException.data = ArrayOfObjectsAfterUpdate;
    this.copyFilterException = this.dataSourceException.data;
    //console.log("this.dataSource.data",this.dataSource.data);
  }
  updateSelectedCellsValuesMetadata(text: string) {
    if (text == null) { return; }
    this.fichierMetadata = this.dataSourceMetaData.data;
    //console.log("this.fichierMetadata",this.fichierMetadata);
    //console.log("1-this.dataSource.data",this.dataSource.data);
    this.fichierMetadata.forEach(function(obj){
      const {Tournee,taskId,itemId, ...newObj} = obj;
      obj = newObj;
      /*delete obj.Tournee;
      delete obj.taskId;
      delete obj.itemId;*/
    });
    var tableauOfCells = [];
    //console.log("this.fichierLivraison",this.fichierLivraison);
    for (let i=0; i< this.fichierMetadata.length; i=i+this.paginator.toArray()[2].pageSize)
    {
      for(let j=0 ; j< this.displayedColumnsMetadata.length; j++)
      {
        var column = this.displayedColumnsMetadata[j];
        var finalArray = this.fichierMetadata.slice(i,i+this.paginator.toArray()[2].pageSize).map(function (obj) {
          return obj[column];
        });
        tableauOfCells = tableauOfCells.concat(finalArray);
      }
    }
    tableauOfCells[this.selectionMetadata[0]] = text;
    var ArrayOfObjectsAfterUpdate = [];
    for (let i=0;i<tableauOfCells.length;i = i+this.displayedColumnsMetadata.length*this.paginator.toArray()[2].pageSize)
    {
      var tableau_slice = tableauOfCells.slice(i,i+this.displayedColumnsMetadata.length*this.paginator.toArray()[2].pageSize);
      //console.log(tableau_slice);
      var round = tableau_slice.length/this.displayedColumnsMetadata.length;
      for(let j=0;j<round;j++)
      {
        var objetTransaction = new Object();
        for(let k=0;k<this.displayedColumnsMetadata.length;k++)
        {
          objetTransaction[this.displayedColumnsMetadata[k]] = tableau_slice[j+k*round];
        }
        ArrayOfObjectsAfterUpdate.push(objetTransaction);
      }
    }
    this.dataSourceMetaData.data = ArrayOfObjectsAfterUpdate;
    this.copyFilterMetaData = this.dataSourceMetaData.data;
    //console.log("this.dataSource.data",this.dataSource.data);
  }
  updateSelectedCellsValuesMad(text: string) {
    if (text == null) { return; }
    this.fichierMad = this.dataSourceMAD.data;
    //console.log("1-this.dataSource.data",this.dataSource.data);
    this.fichierMad.forEach(function(obj){
      const {Tournee,taskId,itemId, ...newObj} = obj;
      obj = newObj;
      /*delete obj.Tournee;
      delete obj.taskId;
      delete obj.itemId;*/
    });
    var tableauOfCells = [];
    //console.log("this.fichierLivraison",this.fichierLivraison);
    for (let i=0; i< this.fichierMad.length; i=i+this.paginator.toArray()[3].pageSize)
    {
      for(let j=0 ; j< this.displayedColumnsMad.length; j++)
      {
        var column = this.displayedColumnsMad[j];
        var finalArray = this.fichierMad.slice(i,i+this.paginator.toArray()[3].pageSize).map(function (obj) {
          return obj[column];
        });
        tableauOfCells = tableauOfCells.concat(finalArray);
      }
    }
    tableauOfCells[this.selectionMad[0]] = text;
    var ArrayOfObjectsAfterUpdate = [];
    for (let i=0;i<tableauOfCells.length;i = i+this.displayedColumnsMad.length*this.paginator.toArray()[3].pageSize)
    {
      var tableau_slice = tableauOfCells.slice(i,i+this.displayedColumnsMad.length*this.paginator.toArray()[3].pageSize);
      //console.log(tableau_slice);
      var round = tableau_slice.length/this.displayedColumnsMad.length;
      for(let j=0;j<round;j++)
      {
        var objetTransaction = new Object();
        for(let k=0;k<this.displayedColumnsMad.length;k++)
        {
          objetTransaction[this.displayedColumnsMad[k]] = tableau_slice[j+k*round];
        }
        ArrayOfObjectsAfterUpdate.push(objetTransaction);
      }
    }
    this.dataSourceMAD.data = ArrayOfObjectsAfterUpdate;
    this.copyFilterMad = this.dataSourceMAD.data;
    //console.log("this.dataSource.data",this.dataSource.data);
  }

    /**
* Correct the file
*/
  correctionFile(index) {
    //this.clickCorrection = true;
    //console.log("this.arrayLivraison",this.arrayLivraison);
    // this.initSelectedCells();
    this.hideUiSelectionOnCorrection();  //hide ui selection on correction
    if (index == "livraison") {  // correction file livraison

      for (let i=0;i<this.arrayLivraison.length;i++)
      { var Tournee = this.arrayLivraison[i].Tournee;
        var taskId = this.arrayLivraison[i].taskId;
        var itemId = this.arrayLivraison[i].itemId;
        this.copyFilterLivraison[i].Tournee = Tournee;
        this.copyFilterLivraison[i].taskId = taskId;
        this.copyFilterLivraison[i].itemId = itemId;
      }
      var arrayOfArray = this.copyFilterLivraison.map(Object.values);
      for(let indice=0;indice<arrayOfArray.length;indice++)
      {
        for(let k=0;k<3;k++)
        {
          var element = arrayOfArray[indice].pop();
          arrayOfArray[indice].unshift(element);
        }
      }
      console.log("arrayOfArray",arrayOfArray);
      this.fileTocheck = {
        transaction_id: this.transaction.transaction_id,
        fileReplacement: {
          columns: [ 'Tournee','taskId','itemId','Date','Expediteur','Activite','Categorie','Type_de_Service','ID_de_la_tache','Item___Nom_sous_categorie','Item___Type_unite_manutention','Item___Quantite','Code_postal','sourceHubName','Round_Name'],
          rows: arrayOfArray,
        }

      }

      this.openSnackBar("Demande de correction envoyée, l’action pourrait prendre quelques minutes", this.snackAction);
      this.service.correctLivraisonFile(this.fileTocheck).subscribe(res => {
        //console.log('resultat correction exception', res);
        if (res.message == "ok") {
          this.router.navigate(['/list-transaction']);
        }
      })
    }
  }
    /**
* Correct the file
*/
correctionFileException(index) 
{
  //this.clickCorrection = true;
  //console.log("this.arrayException",this.arrayException);
  // this.initSelectedCells();
  this.hideUiSelectionOnCorrection();  //hide ui selection on correction
  if (index == "exception") {  // correction file livraison

    for (let i=0;i<this.arrayException.length;i++)
    { var Tournee = this.arrayException[i].Tournee;
      var taskId = this.arrayException[i].taskId;
      var itemId = this.arrayException[i].itemId;
      this.copyFilterException[i].Tournee = Tournee;
      this.copyFilterException[i].taskId = taskId;
      this.copyFilterException[i].itemId = itemId;
    }
    var arrayOfArray = this.copyFilterException.map(Object.values);
    for(let indice=0;indice<arrayOfArray.length;indice++)
    {
      for(let k=0;k<3;k++)
      {
        var element = arrayOfArray[indice].pop();
        arrayOfArray[indice].unshift(element);
      }
    }
    //console.log("arrayOfArray",arrayOfArray);
    this.fileTocheckException = {
      transaction_id: this.transaction.transaction_id,
      fileReplacement: {
        columns: [ 'Tournee','taskId','itemId','Date','Expediteur','Activite','Categorie','Type_de_Service','ID_de_la_tache','Item___Nom','Item___Type','Item___Quantite','Code_postal','Round_Name','Remarque','isDeleted'],
        rows: arrayOfArray,
      }

    }

    this.openSnackBar("Demande de correction envoyée, l’action pourrait prendre quelques minutes", this.snackAction);
    this.service.correctExceptionFile(this.fileTocheckException).subscribe(res => {
      //console.log('resultat correction exception', res);
      if (res.message == "ok") {
        this.router.navigate(['/list-transaction']);
      }
    })
  }
}
correctionFileMetadata(index) {
  //this.clickCorrection = true;
  //console.log("this.arrayMetadata",this.arrayMetaData);
  // this.initSelectedCells();
  this.hideUiSelectionOnCorrection();  //hide ui selection on correction
  if (index == "metadata") {  // correction file livraison

    for (let i=0;i<this.arrayMetaData.length;i++)
    { var Tournee = this.arrayMetaData[i].Tournee;
      var taskId = this.arrayMetaData[i].taskId;
      var itemId = this.arrayMetaData[i].itemId;
      this.copyFilterMetaData[i].Tournee = Tournee;
      this.copyFilterMetaData[i].taskId = taskId;
      this.copyFilterMetaData[i].itemId = itemId;
    }
    var arrayOfArray = this.copyFilterMetaData.map(Object.values);
    for(let indice=0;indice<arrayOfArray.length;indice++)
    {
      for(let k=0;k<3;k++)
      {
        var element = arrayOfArray[indice].pop();
        arrayOfArray[indice].unshift(element);
      }
    }
    //console.log("arrayOfArray",arrayOfArray);
    this.fileTocheckMetadata = {
      transaction_id: this.transaction.transaction_id,
      fileReplacement: {
        columns: [ 'Tournee','taskId','itemId','Date','Expediteur','Activite','Categorie','Type_de_Service','ID_de_la_tache','Item___Nom_sous_categorie','Item___Type_unite_manutention','Item___Quantite','Code_postal','sourceHubName','Round_Name','sourceClosureDate','realInfoHasPrepared','status','metadataFACTURATION'],
        rows: arrayOfArray,
      }

    }

    this.openSnackBar("Demande de correction envoyée, l’action pourrait prendre quelques minutes", this.snackAction);
    this.service.correctMetaDataFile(this.fileTocheckMetadata).subscribe(res => {
      //console.log('resultat correction exception', res);
      if (res.message == "ok") {
        this.router.navigate(['/list-transaction']);
      }
    })
  }
}
    /**
* Correct the file
*/
correctionFileMad(index) {
  //this.clickCorrection = true;
  //console.log("this.arrayLivraison",this.arrayLivraison);
  // this.initSelectedCells();
  this.hideUiSelectionOnCorrection();  //hide ui selection on correction
  if (index == "mad") {  // correction file livraison

    for (let i=0;i<this.arrayMad.length;i++)
    { var Tournee = this.arrayMad[i].Tournee;
      var taskId = this.arrayMad[i].taskId;
      var itemId = this.arrayMad[i].itemId;
      this.copyFilterMad[i].Tournee = Tournee;
      this.copyFilterMad[i].taskId = taskId;
      this.copyFilterMad[i].itemId = itemId;
    }
    var arrayOfArray = this.copyFilterMad.map(Object.values);
    for(let indice=0;indice<arrayOfArray.length;indice++)
    {
      for(let k=0;k<3;k++)
      {
        var element = arrayOfArray[indice].pop();
        arrayOfArray[indice].unshift(element);
      }
    }
    //console.log("arrayOfArray",arrayOfArray);
    this.fileTocheckMad = {
      transaction_id: this.transaction.transaction_id,
      fileReplacement: {
        columns: [ 'Tournee','taskId','itemId','Date','Expediteur','Activite','Categorie','Type_de_Service','ID_de_la_tache','Item___Nom_sous_categorie','Item___Type_unite_manutention','Item___Quantite','Code_postal','sourceHubName','Round_Name'],
        rows: arrayOfArray,
      }

    }

    this.openSnackBar("Demande de correction envoyée, l’action pourrait prendre quelques minutes", this.snackAction);
    this.service.correctMadFile(this.fileTocheckMad).subscribe(res => {
      //console.log('resultat correction exception', res);
      if (res.message == "ok") {
        this.router.navigate(['/list-transaction']);
      }
    })
  }
}
    /**
   * Hide ui selection red rectangle
   */
  hideUiSelectionOnCorrection() {
    if (document.querySelector('.selected')) {
      var inputs = document.querySelectorAll(".selected");
      for (var i = 0; i < inputs.length; i++) {
        inputs[i].classList.remove('selected');
      }
    }
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4500,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }
}


