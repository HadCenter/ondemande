import { Component, Inject, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FacturationTransportService } from "../facturation-transport.service";

@Component({
  selector: "app-dialog-select-transaction",
  templateUrl: "./dialog-select-transaction.component.html",
  styleUrls: ["./dialog-select-transaction.component.scss"],
})
export class DialogSelectTransactionComponent implements OnInit {
  showLowderListTransaction: boolean = true;
  listOfTransactions: any;
  public myForm: FormGroup;
  countPerPage: number = 20;
  copyTransactionsPerPagination: any;
  selectedTransaction: any;
  submitClicked = false;
  liste_clients = [];
  selectedClients: any;
  public toggle = false;
  isclientSelected = false;

  constructor(
    private service: FacturationTransportService,
    public dialogRef: MatDialogRef<DialogSelectTransactionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.getTransactions();
  }

  public getTransactions() {
    this.showLowderListTransaction = true;
    this.service.getAllTransactions().subscribe(
      (res) => {
        this.showLowderListTransaction = false;
        this.copyTransactionsPerPagination = res;
        // this.numPage = Math.ceil(res.length / this.countPerPage);
        this.listOfTransactions = this.getAdvancedTablePage( 1, this.countPerPage);
        // this.listOfTransactions = this.copyTransactionsPerPagination;
        // this.formatDates();
      },
      (error) => {
        this.showLowderListTransaction = false;
      }
    );
  }

  public getAdvancedTablePage(page, countPerPage) {
    return this.copyTransactionsPerPagination.slice(
      (page - 1) * countPerPage,
      page * countPerPage
    );
  }
  submit() {
    this.submitClicked = true;
    this.showLowderListTransaction = true;
    this.liste_clients = [];
    var data = {
      transaction_id: parseInt(this.selectedTransaction[0].transaction_id),
    };
    this.service.seeAllFileTransaction(data).subscribe(
      (res) => {
        this.showLowderListTransaction = false;
        this.liste_clients = res.mad.options.Expediteur;
      },
      (err) => {}
    );
  }
  onNgModelChange() {}

  onChange(event) {
    if (this.selectedClients.length == this.liste_clients.length) {
      this.toggle = true;
    } else {
      this.toggle = false;
    }

    if (this.selectedClients.length == 0) {
      this.isclientSelected = false;
    } else {
      this.isclientSelected = true;
    }
  }

  removeClientsAndFacturate() {
    var data = {
      id: this.selectedTransaction[0].transaction_id,
      clientsToRemove: this.selectedClients,
    };
    this.showLowderListTransaction = true;
    this.service.removeclientsandCopyMADFile(data).subscribe(
      (res) => {
        this.dialogRef.close("submit");
      },
      (err) => {
        this.showLowderListTransaction = false;
      }
    );
  }
}
