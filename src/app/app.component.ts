import { Component, OnInit } from '@angular/core';
import { BillingService } from './services/billing.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{

  constructor( private billingService: BillingService ){}

  ngOnInit(): void {
    this.validateSession();
  }

  validateSession(){
    const billings = JSON.parse(localStorage.getItem('billings')!);

    if( !billings ){
      localStorage.setItem('billings', JSON.stringify( this.billingService.billings ))
    }

  }

}
