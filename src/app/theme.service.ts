import { Injectable } from '@angular/core';
import { generateThemeFromHex, generateThemeFromRGB, styleSheetFromTheme } from './theme';
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
    //this.setThemeFromHexColor('#E4433F')
  }

  async setThemeFromHexColor(color: string) {
    const theme = generateThemeFromHex(color);
    const styles = styleSheetFromTheme(theme, '.main-theme');
    console.log(styles)
    return this.themeStylesheet.replace(styles);
  }



}
