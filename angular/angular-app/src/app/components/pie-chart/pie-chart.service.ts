import { Injectable } from '@angular/core';

@Injectable()
export class PieChartService {
  public getDaySchedule() {
    return [
      {
        key: 'Nourriture',
        nbr: 9,
      },
      {
        key: 'Électronique',
        nbr: 3,
      },
      {
        key: 'Vêtements',
        nbr: 3,
      },
      {
        key: 'Meuble',
        nbr: 3,
      },
      {
        key: 'Matériel sportif',
        nbr: 6,
      },
    ];
  }
}
