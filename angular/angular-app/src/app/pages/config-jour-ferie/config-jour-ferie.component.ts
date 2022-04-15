import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatCalendarCellClassFunction, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { ConfigJourFerieService } from './config-jour-ferie.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-config-jour-ferie',
  templateUrl: './config-jour-ferie.component.html',
  styleUrls: ['./config-jour-ferie.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ConfigJourFerieComponent implements OnInit {
  jourFerieList: string[] = [];
  WeekDays: any[] = [
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
    "Dimanche",
  ]
  selectedDays: string[] = [];
  matrice: any = [];
  unite: any = 1;
  copy_matrice: any = [];
  showLoader = true;
  marge: number = 10;
  minDate = new Date(new Date().getFullYear(), 0, 1);
  maxDate = new Date(this.minDate.getFullYear() + 1, 11, 31);


  constructor(private configjourferieService: ConfigJourFerieService,
    private _snackBar: MatSnackBar,
    private router: Router) { }

  ngOnInit(): void {
    this.getHolidays();
  }
  updateSelectedDays(day) {
    if (this.selectedDays.includes(day)) {
      const i = this.selectedDays.findIndex(
        value =>
          value === day
      );
      this.selectedDays.splice(i, 1);
    } else {
      this.selectedDays.push(day);
    }
  }
  getHolidays() {
    this.configjourferieService.getHolidays().subscribe(res => {
      this.showLoader = false;
      this.jourFerieList = res.holidays.split(',');
      this.marge = res.marge;
      this.copy_matrice = res;
      var selectedDaysNumbers = res.weekends.split(',');
      selectedDaysNumbers.forEach(element => {
        this.selectedDays.push(this.WeekDays[element]);
      });
    })
  }
  /***************check two array are equals **********/
  equals(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
  }
  updateHolidays() {
    var selectedDaysNumbers: number[]=[];
    this.WeekDays.forEach(day=>{
      if(this.selectedDays.includes(day)){
        selectedDaysNumbers.push(this.WeekDays.indexOf(day))
      }
    })
    var data = {
      "holidays": this.jourFerieList.join(),
      "weekends": selectedDaysNumbers.join(),
      "marge": this.marge
    }
    if (this.equals(data, this.copy_matrice) == true) {
      this.openSnackBar('Aucune modification effectuée!', 'Fermé');
    } else {
      this.showLoader = true;
      this.configjourferieService.updateHolidays(data).subscribe(
        res => {
          this.showLoader = false;
          this.openSnackBar('Les modifications sont enregistrées avec succès.', 'Ok');
          this.router.navigate(['/facturation-preparation']);
        },
        err => {
          this.showLoader = false;
          this.openSnackBar('Une erreur est survenue.', 'Ok');
          this.router.navigate(['/facturation-preparation']);
        })
    }
  }
  remove(date: string): void {
    const index = this.jourFerieList.indexOf(date);

    if (index >= 0) {
      this.jourFerieList.splice(index, 1);
    }
  }
  setDate(event: MatDatepickerInputEvent<Date>) {
    console.log(event.value);
    console.log(this.toJSONLocal(event.value));
    this.jourFerieList.push(this.toJSONLocal(event.value));
  }
  // convertir les dates en une chaîne de date conviviale MySQL
  toJSONLocal(date) {
    var local = new Date(date);
    local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
    return (local.toJSON().replace("T", " ")).slice(0, 10);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4500,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: ['custom-snackbar']
    });
  }

}
