import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from 'theme';

import { DetailsOrderRoutingModule } from './details-order-routing.module';
import { DetailsOrderComponent } from './details-order.component';
import { ListOrderService } from '../list-orders/list-orders.service';


@NgModule({
  declarations: [DetailsOrderComponent],
  imports: [
    CommonModule,
    DetailsOrderRoutingModule,
    ThemeModule
  ],
  providers: [
    ListOrderService,
  ],
})
export class DetailsOrderModule { }
