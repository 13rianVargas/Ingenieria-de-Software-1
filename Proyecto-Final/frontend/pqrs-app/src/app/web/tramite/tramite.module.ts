import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TramitePageRoutingModule } from './tramite-routing.module';

import { TramitePage } from './tramite.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TramitePageRoutingModule
  ],
  declarations: [TramitePage]
})
export class TramitePageModule {}
