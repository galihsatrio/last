import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: 'home' },
  { path: 'home', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'master', loadChildren: () => import('./master/master.module').then(m => m.MasterModule), canActivate: [AuthGuard] },
  { path: 'transaksi', loadChildren: () => import('./transaksi/transaksi.module').then(m => m.TransaksiModule), canActivate: [AuthGuard] },
  { path: 'laporan', loadChildren: () => import('./laporan/laporan.module').then(m => m.LaporanModule), canActivate: [AuthGuard] },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
