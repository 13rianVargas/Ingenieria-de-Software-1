import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RadicarPage } from './radicar.page';

const routes: Routes = [
  {
    path: '',
    component: RadicarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RadicarPageRoutingModule {}
