import { Component, OnInit ,Inject} from '@angular/core';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.css']
})
export class SnackbarComponent implements OnInit {

  constructor( @Inject(MAT_SNACK_BAR_DATA) public data: any,public _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    console.warn('***',this.data)
  }

}
