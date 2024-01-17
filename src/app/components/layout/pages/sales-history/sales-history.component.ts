import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Bill } from '../../../../interfaces/bill';
import { BillingService } from '../../../../services/billing.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SaleDetailComponent } from '../../modals/sale-detail/sale-detail.component';
import { OptionsList } from '../../../../interfaces/optionsList';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sales-history',
  templateUrl: './sales-history.component.html',
  styleUrl: './sales-history.component.css',
})
export class SalesHistoryComponent implements OnInit {
  formSearch: FormGroup;
  searchOptions = [
    { value: 'fecha', description: 'Por Fechas' },
    { value: 'codigo', description: 'Por Transacción' },
  ];
  tableColumns = [
    'comercio_codigo',
    'comercio_nombre',
    'comercio_direccion',
    'Trans_estado',
    'Trans_fecha',
    'accion',
  ];
  dataInicio: Bill[] = this.billingService.getBills();
  datosLista = new MatTableDataSource(this.dataInicio);
  invoiceStatus: OptionsList[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private billingService: BillingService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {
    this.formSearch = this.fb.group({
      buscarPor: ['fecha'],
      codigo: [''],
      fechaInicio: [''],
      fechaFin: [''],
    });

    this.formSearch.get('buscarPor')?.valueChanges.subscribe((value) => {
      this.formSearch.patchValue({
        codigo: '',
        fechaInicio: '',
        fechaFin: '',
      });
    });
  }
  ngOnInit(): void {
    this.invoiceStatus = [...this.billingService.invoiceStatus];
  }

  ngAfterViewInit() {
    this.datosLista.paginator = this.paginator;
  }

  verDetalle(detail: Bill) {
    this.dialog.open(SaleDetailComponent, {
      data: detail,
      disableClose: true,
      width: '700px',
    });
  }

  formatDate(fecha: string) {
    return fecha.split(' ', 1)[0];
  }

  transactionStatus(value: number): string {
    const response = this.invoiceStatus.find(
      (element) => element.value === value
    );
    return response ? response.description : '';
  }

  editar(id: number) {
    this.router.navigate(['/billing/actualizar', id]);
  }

  search() {
    if (this.formSearch.value.buscarPor === 'fecha') {
      this.searchByDate();
    } else {
      this.searchByCode();
    }
  }

  searchByDate() {
    const fechaInicio = new Date(this.formSearch.value.fechaInicio);
    const fechaFin = new Date(this.formSearch.value.fechaFin);

    const datos = JSON.parse(localStorage.getItem('billings')!);

    // Filtrar los datos dentro del rango de fechas
    const datosFiltrados = datos.filter((item: Bill) => {
      let fechaTransaccion = new Date(item.Trans_fecha.split(' ', 1)[0]);
      if (fechaTransaccion.toString() === 'Invalid Date') {
        const format = item.Trans_fecha.split(' ', 1)[0];
        const [dia, mes, anio] = format.split('/');
        fechaTransaccion = new Date(`${mes}/${dia}/${anio}`);
      }

      return fechaTransaccion >= fechaInicio && fechaTransaccion <= fechaFin;
    });

    if (datosFiltrados.length > 0) {
      this.datosLista = new MatTableDataSource(datosFiltrados);
      this.datosLista.paginator = this.paginator;
    } else {
      this.snackAlert('No hay registros en este rango de fechas');
    }
  }

  searchByCode() {
    const datos = JSON.parse(localStorage.getItem('billings')!);
    const datosFiltrados = datos.filter(
      (item: Bill) => item.Trans_codigo.includes(this.formSearch.value.codigo)
    );

    if (datosFiltrados.length > 0) {
      this.datosLista = new MatTableDataSource(datosFiltrados);
      this.datosLista.paginator = this.paginator;
    } else {
      this.snackAlert('No hay registros en código');
    }
  }

  reset() {
    this.formSearch.patchValue({
      codigo: '',
      fechaInicio: '',
      fechaFin: '',
    });
    this.datosLista = new MatTableDataSource(this.dataInicio);
    this.datosLista.paginator = this.paginator;
  }

  snackAlert(message: string) {
    this._snackBar.open(message, '', {
      duration: 2000,
      horizontalPosition: 'right',
    });
  }
}
