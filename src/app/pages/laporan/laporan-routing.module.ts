import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LKartuStokComponent } from './l-kartu-stok/l-kartu-stok.component';
import { LPembelianComponent } from './l-pembelian/l-pembelian.component';
import { LPenjualanComponent } from './l-penjualan/l-penjualan.component';
import { LStokComponent } from './l-stok/l-stok.component';


const routes: Routes = [
  {
    path: 'penjualan',
    component : LPenjualanComponent
  },
  {
    path: 'pembelian',
    component : LPembelianComponent
  },
  {
    path: 'stok',
    component : LStokComponent
  },
  {
    path: 'kartu_stok',
    component : LKartuStokComponent 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LaporanRoutingModule { }
