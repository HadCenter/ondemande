import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigCritereRoutingModule } from './config-critere-routing.module';
import { ThemeModule } from 'theme';
import { ConfigCritereComponent } from './config-critere.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfigCritereService } from './config-critere.service';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
@NgModule({
  declarations: [ConfigCritereComponent],
  imports: [
    CommonModule,
    ThemeModule,
    ConfigCritereRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [
    ConfigCritereService,
  ],
})
export class ConfigCritereModule { }
