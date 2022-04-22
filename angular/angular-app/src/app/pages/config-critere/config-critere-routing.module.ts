import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigCritereComponent } from './config-critere.component';
const routes: Routes = [{
                          path: '',
                          component: ConfigCritereComponent,
                          }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigCritereRoutingModule { }
