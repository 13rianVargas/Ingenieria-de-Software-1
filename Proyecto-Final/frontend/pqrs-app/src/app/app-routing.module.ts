import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./mobile/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'radicar',
    loadChildren: () => import('./mobile/radicar/radicar.module').then( m => m.RadicarPageModule)
  },
  {
    path: 'historial',
    loadChildren: () => import('./mobile/historial/historial.module').then( m => m.HistorialPageModule)
  },
  {
    path: 'detalle',
    loadChildren: () => import('./mobile/detalle/detalle.module').then( m => m.DetallePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./web/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./web/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'tramite',
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
