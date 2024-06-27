import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { HydrusTagsService } from '../hydrus-tags.service';

interface TagSiblingsParentsDialogData {
  tag: string;
  allowSearchTag?: boolean;
  allowAddTagToSearch?: boolean;
  allowNewSiblingParentDialog?: boolean;
}

interface TagSiblingsParentsDialogResult {
  action: 'searchTag' | 'addSearchTag' | 'newSiblingParentDialog',
  tag: string
}

@Component({
  selector: 'app-tag-siblings-parents-dialog',
  templateUrl: './tag-siblings-parents-dialog.component.html',
  styleUrls: ['./tag-siblings-parents-dialog.component.scss']
})
export class TagSiblingsParentsDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<TagSiblingsParentsDialogComponent, TagSiblingsParentsDialogResult>,
    @Inject(MAT_DIALOG_DATA) public data: TagSiblingsParentsDialogData,
    private tagsService: HydrusTagsService,
  ) { }

  ngOnInit(): void {
  }

  siblingsAndParents$ = this.tagsService.getTagSiblingsAndParentsArray(this.data.tag);

  static open(dialog: MatDialog, data: TagSiblingsParentsDialogData, config?: MatDialogConfig<TagSiblingsParentsDialogData>) {
    return dialog.open<TagSiblingsParentsDialogComponent, TagSiblingsParentsDialogData, TagSiblingsParentsDialogResult>(
      TagSiblingsParentsDialogComponent,
      {
        width: '720px',
        data,
        ...config
      }
    );
  }

  searchTag(tag: string) {
    this.dialogRef.close({action: 'searchTag', tag});
  }

  addSearchTag(tag: string) {
    this.dialogRef.close({action: 'addSearchTag', tag});
  }

  tagSiblingsParentsDialog(tag: string) {
    this.dialogRef.close({action: 'newSiblingParentDialog', tag});
  }

}
