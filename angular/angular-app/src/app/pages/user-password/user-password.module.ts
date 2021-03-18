import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserPasswordRoutingModule } from './user-password-routing.module';
import { UserPasswordComponent } from './user-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [UserPasswordComponent],
  imports: [
    CommonModule,
    UserPasswordRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class UserPasswordModule { }
