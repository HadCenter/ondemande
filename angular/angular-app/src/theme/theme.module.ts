import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule,NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CardModule } from './components/card';
import { CheckboxComponent } from './components/checkbox';
import { IconToggleComponent } from './components/icon-toggle';
import { PageTopComponent } from './components/page-top';
import { PaginationComponent } from './components/pagination';
import { ProgressComponent } from './components/progress';
import { SidebarModule } from './components/sidebar';
import { SwitchComponent } from './components/switch';
import { ToggleComponent } from './components/toggle';
import { UpgradableComponent } from './components/upgradable';
import { TooltipModule } from './directives/tooltip';
import { PieChartComponent } from './components/pie-chart';

const BASE_COMPONENTS = [
  PageTopComponent,
  CheckboxComponent,
  SwitchComponent,
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
    TooltipModule,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class ThemeModule { }