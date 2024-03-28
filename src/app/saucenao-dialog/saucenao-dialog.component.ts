import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { catchError, Observable, tap } from 'rxjs';
import { AddUrlOptions, HydrusUrlService } from '../hydrus-url.service';
import { SaucenaoService, SaucenaoResults, SaucenaoUrlorFile } from '../saucenao.service';
import { ErrorService } from '../error.service';

interface SaucenaoDialogData {
  urlOrFile: SaucenaoUrlorFile;
  addUrlOptions?: AddUrlOptions;
};

@Component({
  selector: 'app-saucenao-dialog',
  templateUrl: './saucenao-dialog.component.html',
  styleUrls: ['./saucenao-dialog.component.scss']
})
export class SaucenaoDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<SaucenaoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SaucenaoDialogData,
    public saucenaoService: SaucenaoService,
    private addService: HydrusUrlService,
    private snackbar: MatSnackBar,
    private errorService: ErrorService
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

  saucenaoResults$: Observable<SaucenaoResults[]> = this.saucenaoService.search(this.data.urlOrFile).pipe(
    catchError((err, caught) => {
      this.errorService.handleHttpError(err);
      throw err;
    })
  )

  send(url: string) {
    this.addService.addUrl(url, this.data.addUrlOptions).subscribe(res => {
      this.snackbar.open(res.human_result_text, undefined, {
        duration: 5000
      });
    }, error => {
      console.log(error);
      this.errorService.handleHydrusError(error);
    });
  }

  static open(dialog: MatDialog, data?: SaucenaoDialogData, config?: MatDialogConfig<SaucenaoDialogData>) {
    return dialog.open<SaucenaoDialogComponent, SaucenaoDialogData, undefined>(
      SaucenaoDialogComponent,
      {
        maxWidth: '95vw',
        data,
        ...config
      }
    );
  }

}
