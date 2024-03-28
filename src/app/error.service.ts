import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { JsonViewDialogComponent } from './json-view-dialog/json-view-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import {serializeError} from 'serialize-error';

interface HydrusError {
  error: string;
  exception_type: string;
  status_code: HttpStatusCode
}

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  displayError(error: Error, message = 'Error', customText?: string) {
    console.error(error);
    const snackbarRef = this.snackbar.open(`${message}: ${customText ?? error.message ?? error}`, 'Details', {
      duration: 5000
    });
    snackbarRef.onAction().subscribe(() => {
      JsonViewDialogComponent.open(this.dialog, {
        title: message,
        json: serializeError(error),
        copyButton: true
      })
    });
  }

  displayUnknownError(error: unknown, message = 'Error', customText?: string) {
    console.error(error);
    this.snackbar.open(`${message}: ${customText ?? 'Unknown, check the console!'}`, undefined, {
      duration: 5000
    });
  }

  handleError(error: Error | unknown, message?: string) {
    if(error instanceof Error) {
      return this.displayError(error, message);
    } else {
      return this.displayUnknownError(error, message);
    }
  }

  handleHttpError(error: HttpErrorResponse, message?: string) {
    return this.displayError(error, message, `${error.error ?? error.message}`)
  }

  handleHydrusHttpError(error: HttpErrorResponse, message = 'Error') {
    if(typeof error.error === 'object' && 'error' in error.error) {
      const hydrusError: HydrusError = error.error;
      const errorString = hydrusError.error.split('\n')[0];
      return this.displayError(error, message, errorString);
    } else {
      return this.handleHttpError(error, message);
    }
  }

  handleHydrusError(error: HttpErrorResponse | Error | unknown, message = 'Error') {
    if(!(error instanceof HttpErrorResponse)) {
      return this.handleError(error);
    } else {
      return this.handleHydrusHttpError(error, message);
    }
  }
}
