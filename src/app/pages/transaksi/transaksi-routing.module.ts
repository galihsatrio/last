import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TPembelianComponent } from './t-pembelian/t-pembelian.component';
import { TPenjualanComponent } from './t-penjualan/t-penjualan.component';


const routes: Routes = [
  {
    path : 'penjualan',
    component : TPenjualanComponent
  },
  {
    path: 'pembelian',
    component: TPembelianComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransaksiRoutingModule { }
