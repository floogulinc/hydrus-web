import { Injectable } from '@angular/core';
import { getStyleSheetForNamespaces } from './theme-tags';
import { HydrusClientOptionsService } from '../hydrus-client-options.service';
import { HydrusApiSettingsService } from '../hydrus-api-settings.service';
import { distinctUntilChanged, filter, map, switchMap } from 'rxjs';
import { dequal } from 'dequal';

@Injectable({
  providedIn: 'root'
})
export class ThemeTagsService {

  constructor(
    private clientOptions: HydrusClientOptionsService,
    private settings: HydrusApiSettingsService
  ) {

  }

  tagsThemeStylesheet = new CSSStyleSheet();


  async setThemeFromNamespaceColors(namespaceColors: Record<string, [number, number, number]>) {
    const styles = getStyleSheetForNamespaces(namespaceColors);
    return this.tagsThemeStylesheet.replace(styles)
  }

  initTheming() {
    document.adoptedStyleSheets.push(this.tagsThemeStylesheet);

    this.clientOptions.clientOptions$.pipe(
      filter(options => !!options?.old_options?.namespace_colours),
      map(options => options.old_options.namespace_colours),
      distinctUntilChanged(dequal),
      switchMap(namespace_colours => this.setThemeFromNamespaceColors(namespace_colours))
    ).subscribe()

  }


}


const namespace_colours: {[namespace: string]: [number, number, number]} = {
  "character": [
    0,
    170,
    0
  ],
  "creator": [
    170,
    0,
    0
  ],
  "meta": [
    93,
    93,
    93
  ],
  "person": [
    0,
    128,
    0
  ],
  "series": [
    170,
    0,
    170
  ],
  "studio": [
    128,
    0,
    0
  ],
  "system": [
    153,
    101,
    21
  ],
  "null": [
    114,
    160,
    193
  ],
  "": [
    0,
    111,
    250
  ]
}
