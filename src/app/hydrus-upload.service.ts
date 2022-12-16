import { Injectable } from '@angular/core';

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
}

@Injectable({
  providedIn: 'root'
})
export class HydrusUploadService {

  constructor() { }
}
