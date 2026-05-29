import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TramitePageRoutingModule } from './tramite-routing.module';

import { TramitePage } from './tramite.page';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorAlertComponent } from '../../shared/components/error-alert/error-alert.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TramitePageRoutingModule,
    StatusBadgeComponent,
    LoadingSpinnerComponent,
    ErrorAlertComponent
  ],
  declarations: [TramitePage]
})
export class TramitePageModule {}
