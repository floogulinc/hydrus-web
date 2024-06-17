import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HydrusBasicFile } from '../hydrus-file';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { FileInfoSheetComponent } from '../file-info-sheet/file-info-sheet.component';
import { HydrusFileDownloadService } from '../hydrus-file-download.service';

@Component({
  selector: 'app-image-list-item',
  templateUrl: './image-list-item.component.html',
  styleUrl: './image-list-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageListItemComponent {

  constructor(
    private bottomSheet: MatBottomSheet,
    public downloadService: HydrusFileDownloadService,
  ) {

  }

  file = input.required<HydrusBasicFile>()

  selected = input(false)


}
