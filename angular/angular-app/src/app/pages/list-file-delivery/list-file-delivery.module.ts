import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListFileDeliveryRoutingModule } from './list-file-delivery-routing.module';
import { ListFileDeliveryComponent } from './list-file-delivery.component';
import { ListFileDeliveryService } from './list-file-delivery.service';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';



@NgModule({
  declarations: [ListFileDeliveryComponent],
  imports: [
    CommonModule,
    ListFileDeliveryRoutingModule
  ],
  providers: [
    ListFileDeliveryService,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  ],
})
export class ListFileDeliveryModule { }
