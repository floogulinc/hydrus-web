import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HydrusAddFileStatus, HydrusUploadService } from '../hydrus-upload.service';
import { tap, lastValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpEventType } from '@angular/common/http';
import { SettingsService } from '../settings.service';
import { HydrusTagsService } from '../hydrus-tags.service';
import { ErrorService } from '../error.service';
import { FileValidators, NgxFileDragDropComponent } from 'ngx-file-drag-drop';
import { RxState } from '@rx-angular/state';

interface UploadStatus {
  uploading: boolean;
  filename: string;
  percent: number;
}

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss'],
  providers: [RxState]
})
export class UploadFileComponent implements OnInit {

  constructor(
    private uploadService: HydrusUploadService,
    private snackbar: MatSnackBar,
    private settings: SettingsService,
    private tagsService: HydrusTagsService,
    private errorService: ErrorService,
    private state: RxState<UploadStatus>
  ) {
    state.set({ uploading: false, percent: 0 })
  }

  ngOnInit(): void {
  }

  @ViewChild('fileInput') fileInput: NgxFileDragDropComponent;

  // uploadStatus = new BehaviorSubject<UploadStatus>({
  //   uploading: false
  // })


  uploadForm = new FormGroup({
    fileInput: new FormControl<File[]>([], [
      FileValidators.required,
    ]),
    addFilenameTag: new FormControl({value: !!this.settings.appSettings.uploadFilenameTagService, disabled: !this.settings.appSettings.uploadFilenameTagService})
  });

  readonly uploading$ = this.state.select('uploading');
  readonly percentUploaded$ = this.state.select('percent')
  readonly uploadFilename$ = this.state.select('filename')

  onSubmit() {
    console.log(this.uploadForm.value);
    this.handleUpload();
  }

  async handleUpload() {
    if (this.uploadForm.value.fileInput) {
      this.state.set({uploading: true})
      for (let file of this.uploadForm.value.fileInput) {
        try {
          //this.snackbar.open(`Uploading ${file.name}`);
          this.state.set({filename: file.name})
          const response = await lastValueFrom(this.uploadService.addFile(file).pipe(
            tap(x => console.log(x)),
            tap(event => {
              if (event.type === HttpEventType.UploadProgress) {
                const percent = event.total ? 100 * event.loaded / event.total : 0;
                this.state.set({percent})
              }
            })
          ))
          if(response.type === HttpEventType.Response) {
            if(response.body.status === HydrusAddFileStatus.STATUS_SUCCESSFUL_AND_NEW && this.uploadForm.value.addFilenameTag) {
              await lastValueFrom(this.tagsService.addTagsToService(
                response.body.hash,
                [`filename:${file.name}`],
                this.settings.appSettings.uploadFilenameTagService
              ));
            }
            const message = response.body.status === HydrusAddFileStatus.STATUS_SUCCESSFUL_AND_NEW ? 'File Uploaded' : response.body.note;
            this.snackbar.open(message, undefined, {
              duration: 5000
            });
          }
        } catch (error) {
          this.errorService.handleHydrusError(error);
        } finally {
          this.fileInput.removeFile(file);
          this.state.set({filename: null, percent: 0})
        }
      }
      this.state.set({uploading: false})
      //this.uploadForm.reset();
    }
  }

}
