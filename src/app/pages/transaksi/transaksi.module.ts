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

import { TransaksiRoutingModule } from './transaksi-routing.module';
import { TPenjualanComponent } from './t-penjualan/t-penjualan.component';
import { TPembelianComponent } from './t-pembelian/t-pembelian.component';

export const options: Partial <IConfig> = {
  thousandSeparator : '.',
};

@NgModule({
  declarations: [TPenjualanComponent, TPembelianComponent],
  imports: [
    CommonModule,
    TransaksiRoutingModule,
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
export class TransaksiModule { }
