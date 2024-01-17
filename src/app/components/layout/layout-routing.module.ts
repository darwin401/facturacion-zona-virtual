import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { SalesHistoryComponent } from './pages/sales-history/sales-history.component';
import { SaleComponent } from './pages/sale/sale.component';

const routes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    children: [
      { path: "historial", component: SalesHistoryComponent },
      { path: "registrar", component: SaleComponent },
      { path: "actualizar/:id", component: SaleComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
