import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'mobile/login',
    pathMatch: 'full'
  },
  {
    path: 'mobile/login',
    loadChildren: () => import('./mobile/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'mobile/radicar',
    loadChildren: () => import('./mobile/radicar/radicar.module').then( m => m.RadicarPageModule)
  },
  {
    path: 'mobile/historial',
    loadChildren: () => import('./mobile/historial/historial.module').then( m => m.HistorialPageModule)
  },
  {
    path: 'mobile/detalle',
    loadChildren: () => import('./mobile/detalle/detalle.module').then( m => m.DetallePageModule)
  },
  {
    path: 'web/login',
    loadChildren: () => import('./web/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'web/dashboard',
    loadChildren: () => import('./web/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'web/tramite',
    loadChildren: () => import('./web/tramite/tramite.module').then( m => m.TramitePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
