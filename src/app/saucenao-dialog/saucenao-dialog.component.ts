import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, Observable, tap } from 'rxjs';
import { AddUrlOptions, HydrusAddService } from '../hydrus-add.service';
import { SaucenaoService, SaucenaoResults, SaucenaoUrlorFile } from '../saucenao.service';

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
    private addService: HydrusAddService,
    private snackbar: MatSnackBar
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

  saucenaoResults$: Observable<SaucenaoResults[]> = this.saucenaoService.search(this.data.urlOrFile).pipe(
    catchError((err, caught) => {
      this.snackbar.open('Error: ' + err.message, undefined, {
        duration: 5000
      });
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
      this.snackbar.open(`Error: ${error.message}`, undefined, {
        duration: 10000
      });
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
