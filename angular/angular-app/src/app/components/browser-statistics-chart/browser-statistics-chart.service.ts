import { Injectable } from '@angular/core';

@Injectable()
export class BrowserStatisticsChartService {
  public getBrowserStatistics() {
    return [
      {
        key: 'Ahmed',
        y: 42,
      },
      {
        key: 'Aya',
        y: 13,
      },
      {
        key: 'Ilhem',
        y: 14,
      },
      {
        key: 'Zied',
        y: 17,
      },
      {
        key: 'Amine',
        y: 16,
      },
    ];
  }
}
