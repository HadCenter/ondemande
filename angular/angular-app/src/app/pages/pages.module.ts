import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from 'app/components/loader/loader.component';
// import { LoaderComponent } from 'app/components/loader/loader.component';
import { ThemeModule } from 'theme';
import { ErrorComponent } from './error';
import { ForgotPasswordComponent } from './forgot-password';
import { LoginComponent } from './login';
import { PagesRoutingModule } from './pages-routing.module';

//import { SignUpComponent } from './sign-up';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    PagesRoutingModule,
    FormsModule,
    ReactiveFormsModule,

  ],
  declarations: [
    ErrorComponent,
    LoginComponent,
   LoaderComponent,
   // SignUpComponent,
    ForgotPasswordComponent,


  ],
  
  
})
export class PagesModule { }
