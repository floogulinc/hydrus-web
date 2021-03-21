import { Injectable } from '@angular/core';
import { ngxLocalStorage } from 'ngx-localstorage';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';
import { ApiInfo, SettingsState } from './settings.state';

export const hydrusApiKeyPattern: RegExp = /^([a-fA-F]|[0-9]){64}$/;

export interface HydrusKeyVerificationData {
  basic_permissions: number[];
  human_description: string;
}

// tslint:disable: variable-name

@Injectable({
  providedIn: 'root'
})
export class HydrusApiService {


  // @ngxLocalStorage({ prefix: environment.localStoragePrefix })
  // hydrusApiUrl: string;

  // @ngxLocalStorage({ prefix: environment.localStoragePrefix })
  // hydrusApiKey: string;

  @SelectSnapshot(SettingsState.apiInfo) apiInfo: ApiInfo | null;

  constructor(private http: HttpClient) { }


  public getAPIUrl(): string {
    return this.apiInfo.url + (this.apiInfo.url.endsWith('/') ? '' : '/');
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Hydrus-Client-API-Access-Key': this.apiInfo.key
    });
  }

  private apiGet(path: string, params?: HttpParams) {
    return this.http.get(this.getAPIUrl() + path, {
      params,
      headers: this.getHeaders()
    });
  }

  public testApi(): Observable<HydrusKeyVerificationData> {
    return this.http.get<HydrusKeyVerificationData>(this.getAPIUrl() + 'verify_access_key', {
      headers: this.getHeaders()
    });
  }


  /**
   * GET /get_files/search_files
   *
   * Search for the client's files.
   * @param tags (a list of tags you wish to search for)
   * @param options.system_inbox true or false (optional, defaulting to false)
   * @param options.system_archive true or false (optional, defaulting to false)
   * @returns The full list of numerical file ids that match the search.
   */
  public searchFiles(tags: string, options: { system_inbox?: string, system_archive?: string }) {
    let httpParams: HttpParams = new HttpParams().set('tags', tags);
    if (options) {
      if (options.system_inbox) { httpParams = httpParams.set('system_inbox', options.system_inbox); }
      if (options.system_archive) { httpParams = httpParams.set('system_archive', options.system_archive); }
    }
    return this.apiGet('get_files/search_files', httpParams);
  }

  /**
   * GET /get_files/file_metadata
   *
   * Get metadata about files in the client.
   * @param params.file_ids (a list of numerical file ids)
   * @param params.hashes (a list of hexadecimal SHA256 hashes)
   * @param params.only_return_identifiers true or false (optional, defaulting to false)
   * @returns  A list of JSON Objects that store a variety of file metadata.
   */
  public getFileMetadata(params: { file_ids?: string, hashes?: string, only_return_identifiers?: string }) {
    let httpParams: HttpParams = new HttpParams();
    if (params.file_ids) { httpParams = httpParams.set('file_ids', params.file_ids); }
    if (params.hashes) { httpParams = httpParams.set('hashes', params.hashes); }
    if (params.only_return_identifiers) { httpParams = httpParams.set('only_return_identifiers', params.only_return_identifiers); }

    return this.apiGet('get_files/file_metadata', httpParams);
  }

  /**
   * Generates a file's URL from its ID
   * @param file_id the Hydrus ID of the file to get
   * @return the URL of the raw full file referenced by the ID
   */
  public getFileURLFromId(file_id: number): string {
    return this.getAPIUrl() + 'get_files/file?file_id=' + file_id + '&Hydrus-Client-API-Access-Key=' + this.apiInfo.key;
  }

  /**
   * Generates a file's thumbnail URL from its ID
   * @param file_id the Hydrus ID of the file to get a thumbnail of
   * @return the URL of the thumbnail for the file referenced by the ID
   */
  public getThumbnailURLFromId(file_id: number): string {
    return this.getAPIUrl() + 'get_files/thumbnail?file_id=' + file_id + '&Hydrus-Client-API-Access-Key=' + this.apiInfo.key;
  }

  /**
   * Generates a file's URL from its Hash
   * @param file_hash the hash of the file to get
   * @return the URL of the raw full file referenced by the hash
   */
  public getFileURLFromHash(file_hash: string): string {
    return this.getAPIUrl() + 'get_files/file?hash=' + file_hash + '&Hydrus-Client-API-Access-Key=' + this.apiInfo.key;
  }

  /**
   * Generates a file's thumbnail URL from its hash
   * @param file_hash the hash of the file to get a thumbnail of
   * @return the URL of the thumbnail for the file referenced by the hash
   */
  public getThumbnailURLFromHash(file_hash: string): string {
    return this.getAPIUrl() + 'get_files/thumbnail?hash=' + file_hash + '&Hydrus-Client-API-Access-Key=' + this.apiInfo.key;
  }


  public getFileAsBlob(file_hash: string): Observable<Blob> {
    return this.http.get(
      this.getAPIUrl() + 'get_files/file?hash=' + file_hash,
      {
        headers: this.getHeaders(),
        responseType: 'blob'
      },
    );
  }


  /**
   * GET /manage_pages/get_pages
   *
   * Get the page structure of the current UI session.
   */
  public getPages() {
    return this.apiGet('manage_pages/get_pages');
  }

  /**
   * GET /manage_pages/get_page_info
   *
   * Get information about a specific page.
   * @param page_key (hexadecimal page_key as stated in /manage_pages/get_pages)
   * @param simple true or false (optional, defaulting to true)
   */
  public getPageInfo(page_key: string, simple?: string) {
    let httpParams: HttpParams = new HttpParams().set('page_key', page_key);
    if (simple) { httpParams = httpParams.set('simple', simple); }
    return this.apiGet('manage_pages/get_page_info', httpParams);
  }

  /**
   * GET /add_urls/get_url_files
   *
   * Ask the client about an URL's files.
   * @param url (the url you want to ask about)
   */
  public getUrlFiles(url: string) {
    return this.apiGet('add_urls/get_url_files', new HttpParams().set('url', url));
  }

  /**
   * GET /add_urls/get_url_info
   *
   * Ask the client for information about a URL.
   * @param url (the url you want to ask about)
   */
  public getUrlInfo(url: string) {
    return this.apiGet('add_urls/get_url_info', new HttpParams().set('url', url));
  }

  /**
   * POST /add_urls/add_url
   *
   * Tell the client to 'import' a URL. This triggers the exact same routine as drag-and-dropping a text URL onto the main client window.
   * @param data.url (the url you want to add)
   * @param data.destination_page_key (optional page identifier for the page to receive the url)
   * @param data.destination_page_name (optional page name to receive the url)
   * @param data.show_destination_page (optional, defaulting to false, controls whether the UI will change pages on add)
   * @param data.service_names_to_tags (optional tags to give to any files imported from this url)
   */
  public addUrl(data: { url: string,
                        destination_page_key?: string,
                        destination_page_name?: string,
                        show_destination_page?: string,
                        service_names_to_tags?: any}) {

    return this.http.post(this.getAPIUrl() + 'add_urls/add_url',
                          data,
                          {headers: this.getHeaders()});
  }
}
