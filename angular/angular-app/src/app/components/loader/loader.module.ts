import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LoaderComponent } from 'app/components/loader/loader.component';

@NgModule({
  declarations: [LoaderComponent ],
  imports: [
   CommonModule
  ],
  exports:[LoaderComponent],
  entryComponents: [],
  providers: [
  ],
})
export class LoaderModule { }
