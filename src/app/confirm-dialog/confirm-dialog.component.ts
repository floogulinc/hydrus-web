import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';

interface ConfirmDialogData {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
}

const defaultData = {
  confirmText: 'OK',
  cancelText: 'Cancel'
}

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent, ConfirmDialogData>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) { }

  static open(dialog: MatDialog, data: ConfirmDialogData, config?: MatDialogConfig<ConfirmDialogData>) {
    return dialog.open<ConfirmDialogComponent, ConfirmDialogData, boolean>(
      ConfirmDialogComponent,
      {
        data: {...defaultData, ...data},
        maxWidth: '560px',
        ...config
      }
    );
  }

  static confirm(dialog: MatDialog, data: ConfirmDialogData) {
    return this.open(dialog, data).afterClosed()
  }

  static confirmPromise(dialog: MatDialog, data: ConfirmDialogData) {
    return firstValueFrom(this.confirm(dialog, data));
  }

}
