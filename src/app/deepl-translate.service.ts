import { Injectable } from '@angular/core';
import { SettingsService } from './settings.service';
import { HttpClient } from '@angular/common/http';
import { SourceLanguageCode, TargetLanguageCode, TextResult, TranslateTextOptions, buildURLSearchParams, appendTextsAndReturnIsSingular, parseTextResultArray, validateAndAppendTextOptions, parseLanguageArray, LanguageApiResponse, Language } from './deepl';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeeplTranslateService {

  constructor(
    private http: HttpClient,
    private settings: SettingsService
  ) { }

  public get canTranslate(): boolean {
    return !!this.settings.appSettings.deeplApiKey && !!this.settings.appSettings.deeplApiProxy;
  }

  translateText<T extends string | string[]>(
    texts: T,
    sourceLang: SourceLanguageCode | null,
    targetLang: TargetLanguageCode,
    options?: TranslateTextOptions,
  ): Observable<T extends string ? TextResult : TextResult[]> {
    const headers = {
      Authorization: `DeepL-Auth-Key ${this.settings.appSettings.deeplApiKey}`
    };
    const data = buildURLSearchParams(
      sourceLang,
      targetLang,
      options?.formality,
      options?.glossary,
    );
    const singular = appendTextsAndReturnIsSingular(data, texts);
    validateAndAppendTextOptions(data, options);
    return this.http.post(`${this.settings.appSettings.deeplApiProxy}${this.settings.appSettings.deeplApiProxy.endsWith('/') ? '' : '/'}v2/translate`,
      data,
      {
        headers,
        responseType: 'text'
      }).pipe(
        map(content => {
          const textResults = parseTextResultArray(content);
          return (singular ? textResults[0] : textResults) as T extends string
            ? TextResult
            : TextResult[];
        })
      )
  }

  private getLanguages(data: URLSearchParams): Observable<Language[]> {
    const headers = {
      Authorization: `DeepL-Auth-Key ${this.settings.appSettings.deeplApiKey}`
    };
    return this.http.post<LanguageApiResponse[]>(`${this.settings.appSettings.deeplApiProxy}${this.settings.appSettings.deeplApiProxy.endsWith('/') ? '' : '/'}v2/languages`,
      data,
      {
        headers,
      }).pipe(
        map(content => parseLanguageArray(content))
      )
  }


  /**
 * Queries source languages supported by DeepL API.
 * @return Fulfills with array of Language objects containing available source languages.
 */
  getSourceLanguages(): Observable<Language[]> {
    return this.getLanguages(new URLSearchParams());
  }

  /**
   * Queries target languages supported by DeepL API.
   * @return Fulfills with array of Language objects containing available target languages.
   */
  getTargetLanguages(): Observable<Language[]> {
    return this.getLanguages(new URLSearchParams({ type: 'target' }));
  }

}
