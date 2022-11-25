import { Injectable } from '@angular/core';
import { HydrusApiService } from './hydrus-api.service';

@Injectable({
  providedIn: 'root'
})
export class HydrusNotesService {

  constructor(private api: HydrusApiService) { }

  public setNote(hash: string, noteName: string, noteContent: string) {
    return this.api.setNotes({hash, notes: {[noteName]: noteContent}});
  }

  public deleteNote(hash: string, noteName: string) {
    return this.api.deleteNotes({hash, note_names: [noteName]});
  }


}
