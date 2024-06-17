import { Injectable } from '@angular/core';
import { SettingsThemeVariant, ThemeVariant, generateThemeFromHex, generateThemeFromRGB, getMetaThemeColorsFromTheme, settingsThemeVariantToThemeVariant, styleSheetFromTheme } from './theme';
import { HydrusBasicFile } from '../hydrus-file';
import { getBlurHashAverageColor } from 'fast-blurhash';
import { SettingsService } from '../settings.service';
import { filter, switchMap } from 'rxjs';
import { Meta } from '@angular/platform-browser';
import { DynamicScheme } from '@material/material-color-utilities';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor(
    private settings: SettingsService,
    private meta: Meta
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
    console.log(styles)
    try {
      this.updateThemeColorMetaTag(theme);
    } catch (error) {
      console.error(error);
    }
    await this.themeStylesheet.replace(styles);
  }

  async removeTheme() {
    try {
      this.resetThemeColorMetaTag();
    } catch (error) {
      console.error(error);
    }
    return this.themeStylesheet.replace('');
  }

  updateThemeColorMetaTag(theme: {light: DynamicScheme, dark: DynamicScheme}) {
    const {light, dark} = getMetaThemeColorsFromTheme(theme);
    this.meta.updateTag({name: 'theme-color', content: light}, 'data-type=light');
    this.meta.updateTag({name: 'theme-color', content: dark}, 'data-type=dark');
  }

  resetThemeColorMetaTag() {
    this.meta.updateTag({name: 'theme-color', content: '#fbf8ff'}, 'data-type=light');
    this.meta.updateTag({name: 'theme-color', content: '#121318'}, 'data-type=dark');
  }



}
