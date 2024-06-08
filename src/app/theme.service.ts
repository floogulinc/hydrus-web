import { Injectable } from '@angular/core';
import { Variant, generateThemeFromHex, generateThemeFromRGB, styleSheetFromTheme } from './theme';
import { HydrusBasicFile } from './hydrus-file';
import { getBlurHashAverageColor } from 'fast-blurhash';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor() { }

  themeStylesheet = new CSSStyleSheet();

  fileInfoThemeStylesheet = new CSSStyleSheet();

  initTheming() {
    document.adoptedStyleSheets.push(this.themeStylesheet);
    //this.setThemeFromHexColor('#ff0000', Variant.TONAL_SPOT)
  }

  async setThemeFromHexColor(color: string, variant?: Variant) {
    const theme = generateThemeFromHex(color, variant);
    const styles = styleSheetFromTheme(theme, '.main-theme');
    console.log(styles)
    return this.themeStylesheet.replace(styles);
  }

  async removeTheme() {
    return this.themeStylesheet.replace('');
  }



}
