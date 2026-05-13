import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TramitePage } from './tramite.page';

const routes: Routes = [
  {
    path: '',
    component: TramitePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TramitePageRoutingModule {}
