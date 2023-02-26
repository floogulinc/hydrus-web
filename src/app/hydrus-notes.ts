export interface HydrusNotes {
  [name: string]: string;
}

// https://github.com/hydrusnetwork/hydrus/blob/master/hydrus/client/importing/options/NoteImportOptions.py

export enum HydrusNoteImportConflicts {
  REPLACE = 0,
  IGNORE = 1,
  APPEND = 2,
  RENAME = 3
}

export const note_import_conflict_str_lookup = {
  [HydrusNoteImportConflicts.REPLACE] : 'replace the existing note',
  [HydrusNoteImportConflicts.IGNORE] : 'do not add the new note',
  [HydrusNoteImportConflicts.APPEND] : 'append the new note to the end of the existing note',
  [HydrusNoteImportConflicts.RENAME] : 'add the new note under a new name',
}
