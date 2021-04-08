import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from 'app/components/loader/loader.component';
// import { LoaderComponent } from 'app/components/loader/loader.component';
import { ThemeModule } from 'theme';
import { ErrorComponent } from './error';
import { LoginComponent } from './login';
import { PagesRoutingModule } from './pages-routing.module';
import { DetailsFileEdiComponent } from './details-file-edi/details-file-edi.component';
import { ListTransactionComponent } from './list-transaction/list-transaction.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { DetailsTransactionComponent } from './details-transaction/details-transaction.component';


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
   DetailsFileEdiComponent,
   ListTransactionComponent,
   DetailsTransactionComponent,


  ],


})
export class PagesModule { }
