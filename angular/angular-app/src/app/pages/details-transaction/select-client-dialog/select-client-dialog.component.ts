import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectionList } from '@angular/material/list';
import { List } from 'postcss/lib/list';

@Component({
  selector: 'app-select-client-dialog',
  templateUrl: './select-client-dialog.component.html',
  styleUrls: ['./select-client-dialog.component.scss']
})
export class SelectClientDialogComponent implements OnInit {
  @ViewChild('allSelected', { static: true }) private allSelected: MatSelectionList;
  public liste_clients: Array<String> = [];
  allComplete: boolean = false;
  public selectedClients = [];
  public toggle = false;
  private isclientSelected = false;
  constructor(public dialogRef: MatDialogRef<SelectClientDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any) { 

    }

  ngOnInit(): void {
  }

  onChange(event) {
    if (this.selectedClients.length == this.liste_clients.length) {
      this.toggle = true;
    } else {
      this.toggle = false;
    }

    if(this.selectedClients.length == 0){
      this.isclientSelected = false;
    }else{
      this.isclientSelected = true;
    }
}
selectAll() {
  if (this.selectedClients.length == this.liste_clients.length) {
    this.allSelected.deselectAll();
    this.toggle = false;
  } else {
    this.allSelected.selectAll();
    this.toggle = true;
  }
}
}
