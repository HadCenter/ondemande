import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PowerbiEmbeddedComponent } from './powerbi-embedded.component';
import { PowerbiEmbeddedRoutingModule } from './powerbi-embedded-routing.module';



@NgModule({
  declarations: [PowerbiEmbeddedComponent],
  imports: [
    CommonModule,
    PowerbiEmbeddedRoutingModule
  ]
})
export class PowerbiEmbeddedModule { }
