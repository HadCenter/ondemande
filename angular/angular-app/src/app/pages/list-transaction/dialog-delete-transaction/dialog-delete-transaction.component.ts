import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ListTransactionService } from '../list-transaction.service';

@Component({
  selector: 'app-dialog-delete-transaction',
  templateUrl: './dialog-delete-transaction.component.html',
  styleUrls: ['./dialog-delete-transaction.component.scss']
})
export class DialogDeleteTransactionComponent implements OnInit {
  private showloader = false;
  constructor(private transactionservice : ListTransactionService,
    public dialogRef: MatDialogRef<DialogDeleteTransactionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
    public transaction : any;
  ngOnInit(): void {
    this.transaction = this.data.transaction;
  }
  deleteTransaction(){
    this.showloader = true;
    var data = {
      "transaction_id": this.transaction.transaction_id
    }
    
    this.transactionservice.deleteTransaction(data)
      .subscribe(
        response => {
          this.showloader = false;
          this.dialogRef.close('submit');
        });

  }

  cancel(){
    this.dialogRef.close();
  }
}
