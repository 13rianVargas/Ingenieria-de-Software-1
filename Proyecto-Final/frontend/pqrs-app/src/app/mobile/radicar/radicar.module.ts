import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RadicarPageRoutingModule } from './radicar-routing.module';

import { RadicarPage } from './radicar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RadicarPageRoutingModule
  ],
  declarations: [RadicarPage]
})
export class RadicarPageModule {}
