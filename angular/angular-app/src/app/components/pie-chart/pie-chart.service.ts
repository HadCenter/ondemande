import { Injectable } from '@angular/core';

@Injectable()
export class PieChartService {
  public getDaySchedule() {
    return [
      {
        key: 'ahmed',
        nbr: 9,
      },
      {
        key: 'amine',
        nbr: 3,
      },
      {
        key: 'aya',
        nbr: 3,
      },
      {
        key: 'zied',
        nbr: 3,
      },
      {
        key: 'Ilhem',
        nbr: 6,
      },
    ];
  }
}
