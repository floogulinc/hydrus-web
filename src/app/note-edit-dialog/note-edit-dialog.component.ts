import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface NoteEditDialogData {
  noteName?: string;
  noteContent?: string
}

@Component({
  selector: 'app-note-edit-dialog',
  templateUrl: './note-edit-dialog.component.html',
  styleUrls: ['./note-edit-dialog.component.scss']
})
export class NoteEditDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<NoteEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NoteEditDialogData
  ) {
  }

  addMode = !this.data.noteName && !this.data.noteContent;

  ngOnInit(): void {
  }

  static open(dialog: MatDialog, data?: NoteEditDialogData, config?: MatDialogConfig<NoteEditDialogData>) {
    return dialog.open<NoteEditDialogComponent, NoteEditDialogData, {noteName: string, noteContent: string}>(
      NoteEditDialogComponent,
      {
        maxWidth: '648px',
        width: '90vw',
        data: {...data},
        autoFocus: data && data.noteName ? '.note-content' : 'first-tabbable',
        ...config
      }
    );
  }

  noteForm = new FormGroup({
    noteName: new FormControl(this.data.noteName ?? '', {
      nonNullable: true,
      validators: [
        Validators.required,
      ]
    }),
    noteContent: new FormControl(this.data.noteContent ?? '', {nonNullable: true}),
  });

  submitNote() {
    this.dialogRef.close(this.noteForm.value);
  }

}
