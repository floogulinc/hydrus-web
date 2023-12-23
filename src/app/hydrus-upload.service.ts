import { Injectable } from '@angular/core';
import { HydrusApiService } from './hydrus-api.service';

export enum HydrusAddFileStatus {
  STATUS_SUCCESSFUL_AND_NEW = 1,
  STATUS_SUCCESSFUL_BUT_REDUNDANT = 2,
  STATUS_DELETED = 3,
  STATUS_ERROR = 4,
  STATUS_VETOED = 7
}

export interface HydrusAddFileResponse {
  status: HydrusAddFileStatus;
  hash: string;
  note: string;
  traceback?: string;
}

@Injectable({
  providedIn: 'root'
})
export class HydrusUploadService {

  constructor(
    private hydrusApiService: HydrusApiService
  ) { }

  public addFile(file: Blob) {
    return this.hydrusApiService.addFile(file);
  }
}
