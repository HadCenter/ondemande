import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PowerbiEmbeddedComponent } from './powerbi-embedded.component';
import { PowerbiEmbeddedRoutingModule } from './powerbi-embedded-routing.module';
import { NgxPowerBiModule } from 'ngx-powerbi';



@NgModule({
  declarations: [PowerbiEmbeddedComponent],
  imports: [
    CommonModule,
    PowerbiEmbeddedRoutingModule,
    NgxPowerBiModule
  ]
})
export class PowerbiEmbeddedModule { }
