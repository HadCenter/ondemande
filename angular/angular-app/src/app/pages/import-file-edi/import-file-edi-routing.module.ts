import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImportFileEdiComponent } from './import-file-edi.component';


const routes: Routes = [{
  path: '',
  component: ImportFileEdiComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImportFileEdiRoutingModule { }
