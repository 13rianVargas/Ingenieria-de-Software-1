import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard, RoleGuard } from './core/guards';
import { UserRole } from './core/models';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'mobile/login',
    pathMatch: 'full'
  },
  // MOBILE ROUTES - Cliente
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
    canActivate: [AuthGuard, RoleGuard],
    data: { role: UserRole.CLIENTE },
    loadChildren: () => import('./mobile/historial/historial.module').then( m => m.HistorialPageModule)
  },
  {
    path: 'mobile/detalle/:radicado',
    canActivate: [AuthGuard, RoleGuard],
    data: { role: UserRole.CLIENTE },
    loadChildren: () => import('./mobile/detalle/detalle.module').then( m => m.DetallePageModule)
  },
  // WEB ROUTES - Gestor
  {
    path: 'web/login',
    loadChildren: () => import('./web/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'web/dashboard',
    canActivate: [AuthGuard, RoleGuard],
    data: { role: UserRole.GESTOR },
    loadChildren: () => import('./web/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'web/tramite/:radicado',
    canActivate: [AuthGuard, RoleGuard],
    data: { role: UserRole.GESTOR },
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
