import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiSwitchModule } from 'ngx-ui-switch';
import { ArchwizardModule } from 'angular-archwizard';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { Daterangepicker } from 'ng2-daterangepicker';

import {
  NgbAlertModule,
  NgbCarouselModule,
  NgbDropdownModule,
  NgbModalModule,
  NgbProgressbarModule,
  NgbTooltipModule,
  NgbPopoverModule,
  NgbPaginationModule,
  NgbNavModule,
  NgbAccordionModule,
  NgbCollapseModule,
  NgbDatepickerModule,
  NgbModule,
} from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { UIModule } from '../../layouts/shared/ui/ui.module';
import { MasterRoutingModule } from './master-routing.module';

import { PenggunaComponent } from './pengguna/pengguna.component';
import { MBarangComponent } from './m-barang/m-barang.component';
import { MSatuanComponent } from './m-satuan/m-satuan.component';
import { MTipeBarangComponent } from './m-tipe-barang/m-tipe-barang.component';
import { MKonsumenComponent } from './m-konsumen/m-konsumen.component';
import { MSupplierComponent } from './m-supplier/m-supplier.component';
import { MRoleComponent } from './m-role/m-role.component';


export const options: Partial<IConfig> = {
  thousandSeparator: '.',
};


@NgModule({
  declarations: [PenggunaComponent, MBarangComponent, MSatuanComponent, MTipeBarangComponent, MKonsumenComponent, MSupplierComponent, MRoleComponent],
  imports: [
    CommonModule,
    MasterRoutingModule,
    FormsModule,
    UIModule,
    NgbAlertModule,
    NgbCarouselModule,
    NgbDropdownModule,
    NgbDatepickerModule,
    NgbModalModule,
    NgbProgressbarModule,
    NgbTooltipModule,
    NgbPopoverModule,
    NgbPaginationModule,
    NgbNavModule,
    NgbAccordionModule,
    NgSelectModule,
    UiSwitchModule,
    NgbCollapseModule,
    NgbModule,
    ReactiveFormsModule,
    ArchwizardModule,
    DataTablesModule,
    Daterangepicker,
    NgxMaskModule.forRoot(options)
  ]
})
export class MasterModule { }
