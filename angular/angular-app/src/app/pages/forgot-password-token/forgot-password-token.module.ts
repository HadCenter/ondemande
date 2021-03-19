import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgotPasswordTokenRoutingModule } from './forgot-password-token-routing.module';
import { ForgotPasswordTokenComponent } from './forgot-password-token.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ForgotPasswordTokenComponent],
  imports: [
    CommonModule,
    ForgotPasswordTokenRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class ForgotPasswordTokenModule { }
