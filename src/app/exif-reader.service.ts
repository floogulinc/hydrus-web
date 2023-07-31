import { Injectable } from '@angular/core';

import * as ExifReader from 'exifreader';
import { HydrusBasicFile } from './hydrus-file';
import { HydrusFiletype } from './hydrus-file-mimes';


@Injectable({
  providedIn: 'root'
})
export class ExifReaderService {

  constructor() { }

  async getExifTagsForFile(file: HydrusBasicFile) {
    return ExifReader.load(file.file_url, {includeUnknown: true});
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
