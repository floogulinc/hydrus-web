import { Injectable } from '@angular/core';
import { SettingsThemeVariant, ThemeVariant, generateThemeFromHex, generateThemeFromRGB, settingsThemeVariantToThemeVariant, styleSheetFromTheme } from './theme';
import { HydrusBasicFile } from '../hydrus-file';
import { getBlurHashAverageColor } from 'fast-blurhash';
import { SettingsService } from '../settings.service';
import { filter, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor(
    private settings: SettingsService
  ) { }

  themeStylesheet = new CSSStyleSheet();

  //fileInfoThemeStylesheet = new CSSStyleSheet();

  initTheming() {
    document.adoptedStyleSheets.push(this.themeStylesheet);
    this.settings.appSettings$.pipe(
      filter(settings => settings.themeEnabled),
      switchMap(settings => this.setThemeFromHexColor(settings.themeColor, settings.themeVariant))
    ).subscribe()

    this.settings.appSettings$.pipe(
      filter(settings => !settings.themeEnabled),
      switchMap(() => this.removeTheme())
    ).subscribe()
  }

  async setThemeFromHexColor(color: string, variant: SettingsThemeVariant = SettingsThemeVariant.DEFAULT) {
    const theme = generateThemeFromHex(color, settingsThemeVariantToThemeVariant[variant]);
    const styles = styleSheetFromTheme(theme, '.main-theme');
    return this.themeStylesheet.replace(styles);
  }

  async removeTheme() {
    return this.themeStylesheet.replace('');
  }



}
