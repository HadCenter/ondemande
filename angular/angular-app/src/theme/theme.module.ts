import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule,NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CardModule } from './components/card';
import { IconToggleComponent } from './components/icon-toggle';
import { PageTopComponent } from './components/page-top';
import { PaginationComponent } from './components/pagination';
import { ProgressComponent } from './components/progress';
import { SidebarModule } from './components/sidebar';
import { UpgradableComponent } from './components/upgradable';
import { PieChartComponent } from './components/pie-chart';
import { ToggleComponent } from './components/toggle';
const BASE_COMPONENTS = [
  PageTopComponent,
  IconToggleComponent,
  ProgressComponent,
  PaginationComponent,
  ToggleComponent,
  UpgradableComponent,
  PieChartComponent,
];

const BASE_DIRECTIVES = [];

const BASE_PIPES = [];

@NgModule({
  declarations: [
    ...BASE_PIPES,
    ...BASE_DIRECTIVES,
    ...BASE_COMPONENTS,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SidebarModule,
    CardModule,
  ],
  exports: [
    ...BASE_PIPES,
    ...BASE_DIRECTIVES,
    ...BASE_COMPONENTS,
    SidebarModule,
    CardModule,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class ThemeModule { }
