import { Component, OnInit, Inject } from '@angular/core';
import { HydrusFile } from '../hydrus-file';
import {MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';
import { TagUtils } from '../tag-utils';

@Component({
  selector: 'app-file-info-sheet',
  templateUrl: './file-info-sheet.component.html',
  styleUrls: ['./file-info-sheet.component.scss']
})
export class FileInfoSheetComponent {

  tagUtils = TagUtils;

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: {file: HydrusFile}) { }

}
