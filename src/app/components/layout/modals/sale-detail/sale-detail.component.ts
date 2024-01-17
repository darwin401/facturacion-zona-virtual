import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Bill } from '../../../../interfaces/bill';
import { BillingService } from '../../../../services/billing.service';
import { OptionsList } from '../../../../interfaces/optionsList';


@Component({
  selector: 'app-sale-detail',
  templateUrl: './sale-detail.component.html',
  styleUrl: './sale-detail.component.css'
})
export class SaleDetailComponent implements OnInit {

  comercio_codigo: number = 0;
  comercio_nombre: string = '';
  comercio_nit: string = '';
  comercio_direccion: string = '';
  Trans_codigo: string = '';
  Trans_medio_pago: string = '';
  Trans_estado: string = '';
  Trans_total: number = 0;
  Trans_fecha: string = '';
  Trans_concepto: string = '';
  usuario_identificacion: string = '';
  usuario_nombre: string = '';
  usuario_email: string = '';

  paymentMethod : OptionsList[] = [];
  invoiceStatus : OptionsList[] = [];

  constructor(
    private billingService: BillingService,
    @Inject(MAT_DIALOG_DATA) public _bill: Bill,

    ){
    this.paymentMethod = [...this.billingService.paymentMethod];
    this.invoiceStatus = [...this.billingService.invoiceStatus];

    this.comercio_codigo = _bill.comercio_codigo;
    this.comercio_nombre = _bill.comercio_nombre;
    this.comercio_nit = _bill.comercio_nit;
    this.comercio_direccion = _bill.comercio_direccion;
    this.Trans_codigo = _bill.Trans_codigo;
    this.Trans_medio_pago = this.getPaymentMethod(_bill.Trans_medio_pago);
    this.Trans_estado = this.getInvoiceStatus(_bill.Trans_estado);
    this.Trans_total = _bill.Trans_total;
    this.Trans_fecha = _bill.Trans_fecha.split(' ',1)[0];
    this.Trans_concepto = _bill.Trans_concepto;
    this.usuario_identificacion = _bill.usuario_identificacion;
    this.usuario_nombre = _bill.usuario_nombre;
    this.usuario_email = _bill.usuario_email;

  }


  ngOnInit(): void {
  }

  getPaymentMethod( value: number ): string {
    const response = this.paymentMethod.find((element) => element.value === value);
    return response ? response.description : 'Efectivo'
  }
  getInvoiceStatus( value: number ): string {
    const response = this.invoiceStatus.find((element) => element.value === value);
    return response ? response.description : 'Pendiente'
  }


}
