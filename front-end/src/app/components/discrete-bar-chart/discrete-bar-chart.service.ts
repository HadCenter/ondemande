import { Injectable } from '@angular/core';

@Injectable()
export class DiscreteBarChartService {
  public getCumulativeReturn() {
    return [
      {
        label: 'Lundi',
        value: 22,
      },
      {
        label: 'Mardi',
        value: 31,
      },
      {
        label: 'Mercredi',
        value: 10,
      },
      {
        label: 'Jeudi',
        value: 16,
      },
      {
        label: 'Vendredi',
        value: 4,
      },
      {
        label: 'Samedi',
        value: 8,
      },
      {
        label: 'Dimanche',
        value: 10,
      },
    ];
  }
}
