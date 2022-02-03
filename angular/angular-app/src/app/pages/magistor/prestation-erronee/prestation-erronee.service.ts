import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrestationErroneeService {
  public sheet1 : boolean;
  tableMouseDown2: any;
  tableMouseDown: any;
  tableMouseUp2: any;
  tableMouseUp: any;
  LastTableClickedis1: boolean;
  i=0;
  sheet2:any;
  constructor() {

  }
  setSheet1(data) {
    this.sheet1 = data;
  }

  isSheet1() {
    return this.sheet1;
  }
  saveData(data){
    this.i++;
    console.error(this.i)
    if (this.i==1){
      this.sheet1=data;
    }
    else if (this.i==2){
      this.sheet2=data;
      this.i=0;
    }
  }

  settableMouseDown2(data) {
    this.tableMouseDown2 = data;
  }

  gettableMouseDown2() {
    return this.tableMouseDown2;
  }
  settableMouseDown(data) {
    this.tableMouseDown = data;
  }

  gettableMouseDown() {
    return this.tableMouseDown;
  }

  settableMouseUp2(data) {
    this.tableMouseUp2 = data;
  }

  gettableMouseUp2() {
    return this.tableMouseUp2;
  }
  settableMouseUp(data) {
    this.tableMouseUp = data;
  }

  gettableMouseUp() {
    return this.tableMouseUp;
  }


  setLastTableClicked(data) {
    this.LastTableClickedis1 = data;
  }

  getLastTableClicked() {
    return this.LastTableClickedis1;
  }
}
