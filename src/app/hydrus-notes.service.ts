import { Injectable } from '@angular/core';
import { HydrusApiService } from './hydrus-api.service';

@Injectable({
  providedIn: 'root',
})
export class HydrusNotesService {
  constructor(private api: HydrusApiService) {}

  public setNote(hash: string, noteName: string, noteContent: string) {
    return this.api.setNotes({ hash, notes: { [noteName]: noteContent } });
  }

  public addNote(hash: string, noteName: string, noteContent: string) {
    return this.api.setNotes({
      hash,
      notes: { [noteName]: noteContent },
      merge_cleverly: true,
      extend_existing_note_if_possible: false,
    });
  }

  public deleteNote(hash: string, noteName: string) {
    return this.api.deleteNotes({ hash, note_names: [noteName] });
  }
}
