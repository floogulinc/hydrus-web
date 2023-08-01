import { Injectable } from '@angular/core';

import * as ExifReader from 'exifreader';
import { HydrusBasicFile } from './hydrus-file';
import { HydrusFiletype } from './hydrus-file-mimes';
import { firstValueFrom } from 'rxjs';
import { HydrusFilesService } from './hydrus-files.service';


@Injectable({
  providedIn: 'root'
})
export class ExifReaderService {

  constructor(private hydrusFilesService: HydrusFilesService) { }

  async getExifTagsForFile(file: HydrusBasicFile) {
    const fileData = await firstValueFrom(this.hydrusFilesService.getFileAsFile(file));
    return ExifReader.load(fileData, {includeUnknown: true});
  }

  canReadExif(file: HydrusBasicFile) {
    return [
      HydrusFiletype.IMAGE_JPEG,
      HydrusFiletype.IMAGE_PNG,
      HydrusFiletype.IMAGE_TIFF,
      HydrusFiletype.IMAGE_WEBP
      //HEIC/HEIF when added to hydrus
    ].includes(file.file_type)
  }

}
