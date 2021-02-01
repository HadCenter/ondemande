import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListFileEdiRoutingModule } from './list-file-edi-routing.module';
import { ListFileEDIComponent } from './list-file-edi.component';
import { ListFileEdiService } from './list-file-edi.service';


@NgModule({
  declarations: [ListFileEDIComponent],
  imports: [
    CommonModule,
    ListFileEdiRoutingModule
  ],
  providers: [
    ListFileEdiService,
  ],
})
export class ListFileEdiModule { }
