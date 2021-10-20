import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from 'app/components/loader/loader.component';
import { ThemeModule } from 'theme';
import { ErrorComponent } from './error';
import { LoginComponent } from './login';
import { PagesRoutingModule } from './pages-routing.module';
import { DetailsFileEdiComponent } from './details-file-edi/details-file-edi.component';
import { ListTransactionComponent } from './list-transaction/list-transaction.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { DetailsTransactionComponent } from './details-transaction/details-transaction.component';
import { FacturationLogistiqueComponent } from './facturation-logistique/facturation-logistique.component';
import { PowerbiEmbeddedComponent } from './powerbi-embedded/powerbi-embedded.component';

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
   FacturationLogistiqueComponent,
   PowerbiEmbeddedComponent

  ],


})
export class PagesModule { }
