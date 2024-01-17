import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { SaleComponent } from './pages/sale/sale.component';
import { SalesHistoryComponent } from './pages/sales-history/sales-history.component';
import { SharedModule } from '../../../shared/shared.module';
import { SaleDetailComponent } from './modals/sale-detail/sale-detail.component';


@NgModule({
  declarations: [
    SaleComponent,
    SalesHistoryComponent,
    SaleDetailComponent
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,

    SharedModule
  ],
  exports: [
    LayoutRoutingModule
  ]
})
export class LayoutModule { }
