import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PenggunaComponent } from "./pengguna/pengguna.component";
import { MBarangComponent } from "./m-barang/m-barang.component";
import { MSatuanComponent } from './m-satuan/m-satuan.component';
import { MTipeBarangComponent } from './m-tipe-barang/m-tipe-barang.component';
import { MKonsumenComponent } from './m-konsumen/m-konsumen.component';
import { MSupplierComponent } from './m-supplier/m-supplier.component';
import { MRoleComponent } from './m-role/m-role.component';

const routes: Routes = [
  {
    path: 'pengguna',
    component: PenggunaComponent,

  },
  {
    path: 'barang',
    component: MBarangComponent
  },
  {
    path: 'satuan',
    component: MSatuanComponent
  },
  {
    path: 'tipe_barang',
    component: MTipeBarangComponent
  },
  {
    path: 'konsumen',
    component : MKonsumenComponent
  },
  {
    path: 'supplier',
    component : MSupplierComponent
  },
  {
    path: 'role',
    component: MRoleComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterRoutingModule { }
