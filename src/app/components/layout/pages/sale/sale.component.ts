import { Component, OnInit } from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { MatTableDataSource } from '@angular/material/table';

import { BillingService } from '../../../../services/billing.service';
import Swal from 'sweetalert2';
import { Bill } from '../../../../interfaces/bill';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrl: './sale.component.css',
})
export class SaleComponent implements OnInit {
  formNewBill: FormGroup;

  invoiceStatus;
  paymentMethod;

  registerActive: Boolean = false;
  id!: number;
  titulo: string = 'Registrar';
  pendingStatusCode: number = 999;
  paymentMethodCode: number = 0;
  esDeshabilitado: boolean = false;

  constructor(
    private fb: FormBuilder,
    private billingService: BillingService,
    private router: Router,
    private activateRoute: ActivatedRoute
  ) {
    this.id = parseInt(this.activateRoute.snapshot.paramMap.get('id')!);

    this.formNewBill = this.fb.group({
      comercio_codigo: new FormControl(
        { value: '', disabled: this.id ? true : false },
        Validators.required
      ),
      comercio_nombre: ['', Validators.required],
      comercio_nit: ['', Validators.required],
      comercio_direccion: ['', Validators.required],
      Trans_codigo: new FormControl(
        { value: '', disabled: this.id ? true : false },
        Validators.required
      ),
      Trans_medio_pago: ['', Validators.required],
      Trans_estado: ['', Validators.required],
      Trans_total: ['', Validators.required],
      Trans_fecha: ['', Validators.required],
      Trans_concepto: ['', Validators.required],
      usuario_identificacion: ['111111'],
      usuario_nombre: ['', Validators.required],
      usuario_email: ['Test@test.tst'],
    });

    this.invoiceStatus = [...this.billingService.invoiceStatus];
    this.paymentMethod = [...this.billingService.paymentMethod];
  }
  ngOnInit(): void {
    if (this.id) {
      this.getBill(this.id);
      this.titulo = 'Editar';
    }
  }

  agregarFactura() {
    if (
      !this.id &&
      this.billingService.validateExisting(this.formNewBill.value.Trans_codigo)
    ) {
      Swal.fire({
        icon: 'info',
        title: 'Ooops !!',
        text: 'El Código de transacción debe ser único ',
      });
      return;
    }

    if (this.formNewBill.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Ooops !!',
        text: 'Todos los campos son necesarios',
      });
      return;
    }

    const fecha = this.formatDate(this.formNewBill.value.Trans_fecha);

    const body = { ...this.formNewBill.value, Trans_fecha: fecha };

    if (this.id) {
      this.billingService.updateBills(this.id, body);
    } else {
      this.billingService.saveInvoice(body);
    }

    Swal.fire({
      icon: 'success',
      title: 'Proceso finalizado',
      text: 'El registro fue guardado con éxito',
    });

    setTimeout(() => {
      this.router.navigateByUrl('/billing/historial');
    }, 1000);
  }

  update() {
    this.agregarFactura();
  }

  getBill(id: number) {
    const bill = this.billingService.getBillById(id);

    let fecha = new Date(bill.Trans_fecha.split(' ', 1)[0]);

    if (fecha.toString() === 'Invalid Date') {
      const format = bill.Trans_fecha.split(' ', 1)[0];
      const [dia, mes, anio] = format.split('/');
      fecha = new Date(`${mes}/${dia}/${anio}`);
    }

    this.formNewBill.setValue({
      comercio_codigo: bill.comercio_codigo,
      comercio_nombre: bill.comercio_nombre,
      comercio_nit: bill.comercio_nit,
      comercio_direccion: bill.comercio_direccion,
      Trans_codigo: bill.Trans_codigo,
      Trans_medio_pago: this.validateMethods(bill.Trans_medio_pago),
      Trans_estado: this.validateStatus(bill.Trans_estado),
      Trans_total: bill.Trans_total,
      Trans_fecha: new Date(fecha),
      Trans_concepto: bill.Trans_concepto,
      usuario_identificacion: bill.usuario_identificacion,
      usuario_nombre: bill.usuario_nombre,
      usuario_email: bill.usuario_email,
    });
  }

  formatDate(fecha: Date) {
    const fechaObj = new Date(fecha);
    const mes = fechaObj.getMonth() + 1;
    const dia = fechaObj.getDate();
    const anio = fechaObj.getFullYear();

    const mesFormateado = mes < 10 ? `0${mes}` : mes;
    const diaFormateado = dia < 10 ? `0${dia}` : dia;

    return `${anio}/${mesFormateado}/${diaFormateado}`;
  }

  validateMethods(methodId: number) {
    const method = this.paymentMethod.some(
      (method) => method.value === methodId
    );
    return method ? methodId : this.paymentMethodCode;
  }
  validateStatus(statusId: number) {
    const status = this.invoiceStatus.some(
      (status) => status.value === statusId
    );
    return status ? statusId : this.pendingStatusCode;
  }
  cancel(){
    this.router.navigate(['/billing/historial']);
  }
}
