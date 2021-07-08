import { Component, HostBinding, Inject, OnInit, ViewChild } from '@angular/core';
import { UpgradableComponent } from 'theme/components/upgradable';
import { ListFileEdiArchivesService } from './list-file-edi-archives.service';

import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-list-file-edi-archives',
  templateUrl: './list-file-edi-archives.component.html',
  styleUrls: ['./list-file-edi-archives.component.scss']
})
export class ListFileEdiArchivesComponent extends UpgradableComponent implements OnInit{
  @HostBinding('class.mdl-grid') private readonly mdlGrid = true;
  @HostBinding('class.mdl-cell') private readonly mdlCell = true;
  @HostBinding('class.mdl-cell--12-col-desktop') private readonly mdlCell12ColDesktop = true;
  @HostBinding('class.mdl-cell--12-col-tablet') private readonly mdlCell12ColTablet = true;
  @HostBinding('class.mdl-cell--4-col-phone') private readonly mdlCell4ColPhone = true;
  @HostBinding('class.mdl-cell--top') private readonly mdlCellTop = true;
  @HostBinding('class.ui-tables') private readonly uiTables = true;
    //Material Table Setting for columns and datasource
  displayedColumns: string[] = ['Fichier EDI', 'Date création', 'Nom client', 'Statut'];
  advancedTable: any = [];
  dataSource = new MatTableDataSource<any>(this.advancedTable);
  //Material table sorting and pagination settings
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  clientList: any = [];
  showLoaderArchivedEdiFile = true;

  constructor(private tableService: ListFileEdiArchivesService,) {
    super();
  }
  ngOnInit() {
    this.getAllArchivedFiles();
  }

  getColor(ch) {
    if (ch === 'En attente') {
      return 'blue';
    } else if (ch === 'Terminé') {
      return 'green';
    } else if (ch === 'En cours') {
      return 'orange';
    } else {
      return 'red';
    }
  }
  getAllArchivedFiles()
  {
    this.tableService.getAllArchivedFiles().subscribe(
      res => {
        this.dataSource.paginator = this.paginator;
        this.advancedTable = res;
        this.clientList = [...new Set(this.advancedTable.map(a => a.contact.nomClient))];
        this.dataSource.data = this.advancedTable;
        //Custom filter according to ClientName column
        this.dataSource.filterPredicate = (data, filterValue: string) => data.contact.nomClient.trim().toLowerCase().indexOf(filterValue) !== -1;
        this.showLoaderArchivedEdiFile = false;
      }
    );
  }
    //Select input onchange function
  onChange(getName)
  {
    /* configure filter */
    this.dataSource.filter = getName.trim().toLowerCase();
  }
}
