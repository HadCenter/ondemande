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
    console.warn('**snackbar data*',this.data);
    this.data.forEach((element, index) => {
      if ((element.archive !== true && element.existe !== true) || element.existe !== true) {
        this.data.slice(index, 1);
      }
    });
  }

}
