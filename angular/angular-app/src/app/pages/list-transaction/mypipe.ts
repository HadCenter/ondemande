import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({ name: 'mypipe' })
export class Mypipe implements PipeTransform {
  // adding a default format in case you don't want to pass the format
  // then 'yyyy-MM-dd' will be used
  transform(date: Date | string, day: number, format: string = 'yyyy-MM-dd'): string {
    date = date.toString();
    date = [date.slice(3, 5), date.slice(0, 2), date.slice(6, 10), date.slice(12, 20)].join('-');
    date = new Date(date);  // if orginal type was a string
    return new DatePipe('en-US').transform(date, format);
  }
}

