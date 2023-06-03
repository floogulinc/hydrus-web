import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FileInput } from 'ngx-material-file-input';
import { HydrusAddFileStatus, HydrusUploadService } from '../hydrus-upload.service';
import { last, tap, lastValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {

  constructor(
    private uploadService: HydrusUploadService,
    private snackbar: MatSnackBar,
  ) { }

  ngOnInit(): void {
  }

  uploadForm = new FormGroup({
    fileInput: new FormControl<FileInput>(null, [
      Validators.required,
    ]),
    addFilenameTag: new FormControl({value: false, disabled: true})
  });

  onSubmit() {
    console.log(this.uploadForm.value);
    this.handleUpload();
  }

  async handleUpload() {
    if (this.uploadForm.value.fileInput) {
      for (let file of this.uploadForm.value.fileInput.files) {
        this.snackbar.open(`Uploading ${file.name}`);
        const response = await lastValueFrom(this.uploadService.addFile(file).pipe(
          tap(x => console.log(x)),
          // tap(event => {
          //   if (event.type === HttpEventType.UploadProgress) {
          //     const percentDone = event.total ? Math.round(100 * event.loaded / event.total) : 0;
          //     this.snackbar.open(`Uploading ${file.name}: ${percentDone}%`);
          //   }
          // })
        ));
        if(response.type === HttpEventType.Response) {
          const message = response.body.status === HydrusAddFileStatus.STATUS_SUCCESSFUL_AND_NEW ? 'File Uploaded' : response.body.note;
          this.snackbar.open(message, undefined, {
            duration: 5000
          });
        }
      }
      this.uploadForm.reset();
    }
  }

}
