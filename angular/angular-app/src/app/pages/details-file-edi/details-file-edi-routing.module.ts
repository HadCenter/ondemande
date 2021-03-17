import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailsFileEdiComponent } from './details-file-edi.component';


const routes: Routes = [{
  path: '',
  component: DetailsFileEdiComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetailsFileEdiRoutingModule { }
