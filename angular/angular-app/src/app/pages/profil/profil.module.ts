import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfilRoutingModule } from './profil-routing.module';
import { ProfilComponent } from './profil.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThemeModule } from 'theme';

@NgModule({
  declarations: [ProfilComponent],
  imports: [
    CommonModule,
    ProfilRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ThemeModule
  ]
})
export class ProfilModule { }
