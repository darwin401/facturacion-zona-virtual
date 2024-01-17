import { Injectable } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root'
})
export class AlertasService {

  constructor( private _snackBar: MatSnackBar ) { }

  shwAlert( message: string, type: string ) {
    this._snackBar.open(message, type, {
      horizontalPosition: "end",
      verticalPosition: "top",
      duration: 2000
    })
  }

}
