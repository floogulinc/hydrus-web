import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders, HttpParameterCodec } from '@angular/common/http';
import { HydrusSortType } from './hydrus-sort';
import { HydrusBasicFileFromAPI, HydrusFileFromAPI } from './hydrus-file';
import { HydrusSearchTags, HydrusTagSearchTag, ServiceNamesOrKeysToActionsToTags, ServiceNamesOrKeysToTags, TagDisplayType, TagsToServiceKeysToSiblingsAndParents } from './hydrus-tags';
import { HydrusBonedStats } from './hydrus-mr-bones';
import { HydrusServiceInfo, HydrusServices } from './hydrus-services';
import { HydrusAddURLResponse, HydrusURLFiles, HydrusURLInfo, HydrusURLServiceNamesToTags } from './hydrus-url';
import { HydrusVersionResponse } from './hydrus-version';
import { HydrusNoteImportConflicts } from './hydrus-notes';
import { HydrusApiSettingsService } from './hydrus-api-settings.service';
import { HydrusAddFileResponse } from './hydrus-upload.service';
import { HydrusKeyVerificationData, HydrusRequestFileDomain, HydrusRequestFiles, HydrusRequestSingleFile } from './hydrus-api';
import { HydrusJobStatus, HydrusJobStatusAddRequest, HydrusJobStatusUpdateRequest } from './hydrus-job-status';
import { HydrusPage, HydrusPageListItem } from './hydrus-page';
import { HydrusClientOptions } from './hydrus-client-options';

type AngularHttpParams =  {
  [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
}


class CustomHttpUrlEncodingCodec implements HttpParameterCodec {
  /**
   * Encodes a key name for a URL parameter or query-string.
   * @param key The key name.
   * @returns The encoded key name.
   */
  encodeKey(key: string): string {
    return encodeURIComponent(key);
  }

  /**
   * Encodes the value of a URL parameter or query-string.
   * @param value The value.
   * @returns The encoded value.
   */
  encodeValue(value: string): string {
    return encodeURIComponent(value);
  }

  /**
   * Decodes an encoded URL parameter or query-string key.
   * @param key The encoded key name.
   * @returns The decoded key name.
   */
  decodeKey(key: string): string {
    return decodeURIComponent(key);
  }

  /**
   * Decodes an encoded URL parameter or query-string value.
   * @param value The encoded value.
   * @returns The decoded value.
   */
  decodeValue(value: string) {
    return decodeURIComponent(value);
  }
}



@Injectable({
  providedIn: 'root'
})
export class HydrusApiService {

  constructor(private http: HttpClient, private apiSettings: HydrusApiSettingsService) { }

  apiSet = this.apiSettings.apiSet;
  apiSet$ = this.apiSettings.apiSet$;

  apiValidConfigChange$ = this.apiSettings.apiValidConfigChange$;



  private get hydrusApiUrl() {
    return this.apiSettings.hydrusApiUrl();
  }

  private get hydrusApiKey() {
    return this.apiSettings.hydrusApiKey();
  }

  public getAPIUrl(): string {
    return this.hydrusApiUrl + (this.hydrusApiUrl?.endsWith('/') ? '' : '/');
  }

  private get headers() {
    return {
      'Hydrus-Client-API-Access-Key': this.hydrusApiKey
    };
  }

  private apiGet<T = any>(path: string, params?: AngularHttpParams, noCache = false) {
    const cacheHeaders: Record<string, string> = noCache ? {
      'Cache-Control': 'no-cache'
    } : { };

    const requestParams = new HttpParams({fromObject: params, encoder: new CustomHttpUrlEncodingCodec()});

    return this.http.get<T & Partial<HydrusVersionResponse>>(this.getAPIUrl() + path, {
      params: requestParams,
      headers: {...this.headers, ...cacheHeaders}
    });
  }

  private apiPost<T>(path: string, data: any) {
    return this.http.post<T>(this.getAPIUrl() + path,
                          data,
                          {headers: this.headers});
  }

  public testApi(): Observable<HydrusKeyVerificationData> {
    return this.http.get<HydrusKeyVerificationData>(this.getAPIUrl() + 'verify_access_key', {
      headers: this.headers
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
  /* public searchFiles(tags: string, options: { system_inbox?: string, system_archive?: string }) {
    let httpParams: HttpParams = new HttpParams().set('tags', tags);
    if (options) {
      if (options.system_inbox) { httpParams = httpParams.set('system_inbox', options.system_inbox); }
      if (options.system_archive) { httpParams = httpParams.set('system_archive', options.system_archive); }
    }
    return this.apiGet('get_files/search_files', httpParams);
  } */


  /**
   * GET /get_files/search_files
   *
   * Search for the client's files.
   * @param tags (a list of tags you wish to search for)
   * @param params additional parameters
   * @returns The full list of numerical file ids or hashes that match the search.
   */
   public searchFiles<Hashes extends boolean, IDs extends boolean>(
    tags: HydrusSearchTags,
    params: {
      tag_service_key?: string;
      file_sort_type?: HydrusSortType;
      file_sort_asc?: boolean;
      return_hashes?: Hashes;
      return_file_ids?: IDs;
    } & HydrusRequestFileDomain = {},
  ): Observable<
    (Hashes extends true ? { hashes: string[] } : Record<string, never>) &
      (IDs extends true ? { file_ids: number[] } : Record<string, never>)
  > {
    return this.apiGet('get_files/search_files', {
      tags: JSON.stringify(tags),
      ...params,
    });
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
  /* public getFileMetadata(params: { file_ids?: string, hashes?: string, only_return_identifiers?: string }) {
    let httpParams: HttpParams = new HttpParams();
    if (params.file_ids) { httpParams = httpParams.set('file_ids', params.file_ids); }
    if (params.hashes) { httpParams = httpParams.set('hashes', params.hashes); }
    if (params.only_return_identifiers) { httpParams = httpParams.set('only_return_identifiers', params.only_return_identifiers); }

    return this.apiGet('get_files/file_metadata', httpParams);
  } */


  /**
   * GET /get_files/file_metadata
   *
   * Get metadata about files in the client.
   * @param params.file_ids (a list of numerical file ids)
   * @param params.hashes (a list of hexadecimal SHA256 hashes)
   * @param params.only_return_identifiers true or false (optional, defaulting to false)
   * @param params.only_return_basic_information true or false (optional, defaulting to false)
   * @param params.detailed_url_information true or false (optional, defaulting to false)
   * @param params.include_notes true or false (optional, defaulting to false)
   * @param params.include_services_object true or false (optional, defaulting to true)
   * @returns  A list of JSON Objects that store a variety of file metadata.
   */
   public getFileMetadata<Identifiers extends boolean, Basic extends boolean>(
    params: ({ hashes: string[] } | { file_ids: number[] }) & {
      only_return_identifiers?: Identifiers;
      only_return_basic_information?: Basic;
      detailed_url_information?: boolean;
      include_notes?: boolean;
      include_services_object?: boolean;
      include_blurhash?: boolean;
      include_milliseconds?: boolean;
    },
    noCache = false
  ) {
    let newParams: AngularHttpParams;
    if ('hashes' in params) {
      //this.logger.debug(`getFileMetadata ${params.hashes}`);
      newParams = {
        ...params,
        hashes: JSON.stringify(params.hashes),
      };
    } else {
      //this.logger.debug(`getFileMetadata ${params.file_ids}`);
      newParams = {
        ...params,
        file_ids: JSON.stringify(params.file_ids),
      };
    }
    return this.apiGet<{ services?: HydrusServices, metadata: Identifiers extends true ? {file_id: number, hash: string }[] : Basic extends true ? HydrusBasicFileFromAPI[] : HydrusFileFromAPI[] }>('get_files/file_metadata', newParams, noCache);
  }

  /**
   * Generates a file's URL from its ID
   * @param file_id the Hydrus ID of the file to get
   * @return the URL of the raw full file referenced by the ID
   */
  public getFileURLFromId(file_id: number): string {
    return this.getAPIUrl() + 'get_files/file?file_id=' + file_id + '&Hydrus-Client-API-Access-Key=' + this.hydrusApiKey;
  }

  /**
   * Generates a file's thumbnail URL from its ID
   * @param file_id the Hydrus ID of the file to get a thumbnail of
   * @return the URL of the thumbnail for the file referenced by the ID
   */
  public getThumbnailURLFromId(file_id: number): string {
    return this.getAPIUrl() + 'get_files/thumbnail?file_id=' + file_id + '&Hydrus-Client-API-Access-Key=' + this.hydrusApiKey;
  }

  /**
   * Generates a file's URL from its Hash
   * @param file_hash the hash of the file to get
   * @return the URL of the raw full file referenced by the hash
   */
  public getFileURLFromHash(file_hash: string): string {
    return this.getAPIUrl() + 'get_files/file?hash=' + file_hash + '&Hydrus-Client-API-Access-Key=' + this.hydrusApiKey;
  }

  /**
   * Generates a file's thumbnail URL from its hash
   * @param file_hash the hash of the file to get a thumbnail of
   * @return the URL of the thumbnail for the file referenced by the hash
   */
  public getThumbnailURLFromHash(file_hash: string): string {
    return this.getAPIUrl() + 'get_files/thumbnail?hash=' + file_hash + '&Hydrus-Client-API-Access-Key=' + this.hydrusApiKey;
  }

  /**
   * Generates a file's render URL from its Hash
   * @param file_hash the hash of the file to get a render of
   * @return the URL of the rendered file referenced by the hash
   */
  public getRenderedURLFromHash(file_hash: string): string {
    return this.getAPIUrl() + 'get_files/render?hash=' + file_hash + '&Hydrus-Client-API-Access-Key=' + this.hydrusApiKey;
  }


  public getFileAsBlob(file_hash: string): Observable<Blob> {
    return this.http.get(
      this.getAPIUrl() + 'get_files/file?hash=' + file_hash,
      {
        headers: this.headers,
        responseType: 'blob'
      },
    );
  }

  public getThumbAsBlob(file_hash: string): Observable<Blob> {
    return this.http.get(
      this.getAPIUrl() + 'get_files/thumbnail?hash=' + file_hash,
      {
        headers: this.headers,
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
    return this.apiGet<{pages: HydrusPageListItem}>('manage_pages/get_pages');
  }

  /**
   * GET /manage_pages/get_page_info
   *
   * Get information about a specific page.
   * @param page_key (hexadecimal page_key as stated in /manage_pages/get_pages)
   * @param simple true or false (optional, defaulting to true)
   */
  public getPageInfo(page_key: string, simple?: string) {
    let httpParams: AngularHttpParams = {page_key}
    if (simple) {
      httpParams =  {...httpParams, simple}
    }
    return this.apiGet<{page_info: HydrusPage}>('manage_pages/get_page_info', httpParams, true);
  }

  public refreshPage(page_key: string) {
    return this.apiPost<{page_key: string}>('manage_pages/refresh_page', {page_key});
  }


  /**
   * GET /add_urls/get_url_files
   *
   * Ask the client about an URL's files.
   * @param url (the url you want to ask about)
   */
  public getUrlFiles(url: string) {
    return this.apiGet<HydrusURLFiles>('add_urls/get_url_files', {url});
  }

  /**
   * GET /add_urls/get_url_info
   *
   * Ask the client for information about a URL.
   * @param url (the url you want to ask about)
   */
  public getUrlInfo(url: string) {
    return this.apiGet<HydrusURLInfo>('add_urls/get_url_info', {url});
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
                        service_names_to_tags?: HydrusURLServiceNamesToTags}) {
    return this.apiPost<HydrusAddURLResponse>('add_urls/add_url', data);
  }


  public associateUrls(data: {
    url_to_add?: string,
    urls_to_add?: string[],
    url_to_delete?: string,
    urls_to_delete?: string[],

  } & HydrusRequestFiles) {
    return this.apiPost<void>('add_urls/associate_url', data);
  }

  public searchTags(params: {
    search: string,
    tag_service_key?: string,
    tag_service_name?: string,
    tag_display_type?: TagDisplayType
  }) {
    return this.apiGet<{tags: HydrusTagSearchTag[]}>('add_tags/search_tags', params);
  }


  public deleteFiles(data: {
    reason?: string
  } & HydrusRequestFiles & Pick<HydrusRequestFileDomain, 'file_service_key' | 'file_service_keys'>) {
    return this.apiPost<void>('add_files/delete_files', data);
  }

  public undeleteFiles(data: HydrusRequestFiles & HydrusRequestFileDomain) {
    return this.apiPost<void>('add_files/undelete_files', data);
  }

  public archiveFiles(data: HydrusRequestFiles & HydrusRequestFileDomain) {
    return this.apiPost<void>('add_files/archive_files', data);
  }

  public unarchiveFiles(data: HydrusRequestFiles & HydrusRequestFileDomain) {
    return this.apiPost<void>('add_files/unarchive_files', data);
  }

  public mrBones() {
    return this.apiGet<{boned_stats: HydrusBonedStats}>('manage_database/mr_bones');
  }

  public getServices(): Observable<HydrusServiceInfo> {
    return this.apiGet<HydrusServiceInfo>('get_services');
  }

  public addTags(data: {
    service_names_to_tags?: ServiceNamesOrKeysToTags,
    service_keys_to_tags?: ServiceNamesOrKeysToTags,
    service_names_to_actions_to_tags?: ServiceNamesOrKeysToActionsToTags,
    service_keys_to_actions_to_tags?: ServiceNamesOrKeysToActionsToTags
  } & HydrusRequestFiles) {
    return this.apiPost<void>('add_tags/add_tags', data);
  }

  public setNotes(data: {
    notes: Record<string, string>,
    merge_cleverly?: boolean,
    extend_existing_note_if_possible?: boolean
    conflict_resolution?: HydrusNoteImportConflicts
  } & HydrusRequestSingleFile) {
    return this.apiPost<void>('add_notes/set_notes', data);
  }

  public deleteNotes(data: {
    note_names: string[]
  } & HydrusRequestSingleFile) {
    return this.apiPost<void>('add_notes/delete_notes', data);
  }

  public getApiVersion() {
    return this.apiGet<HydrusVersionResponse>('api_version');
  }

  public addFile(file: Blob) {
    return this.http.post<HydrusAddFileResponse>(
      this.getAPIUrl() + 'add_files/add_file',
      file,
      {
        headers: {
          ...this.headers,
          'Content-Type': 'application/octet-stream',
          'ngsw-bypass': ''
        },
        reportProgress: true,
        observe: 'events'
      }
    );
  }

  public setRating(data: {
    hash: string,
    rating_service_key: string,
    rating: number | boolean | null
  }) {
    return this.apiPost('edit_ratings/set_rating', data);
  }

  public getSiblingsAndParents(tags: string[], noCache = false) {
    return this.apiGet<{ services: HydrusServices, tags: TagsToServiceKeysToSiblingsAndParents}>('add_tags/get_siblings_and_parents', {tags: JSON.stringify(tags)}, noCache);
  }

  public getPopups(only_in_view?: boolean, noCache = false) {
    return this.apiGet<{ job_statuses: HydrusJobStatus[]}>('manage_popups/get_popups', {only_in_view}, noCache);
  }

  public addPopup(data: HydrusJobStatusAddRequest) {
    return this.apiPost<{ job_status: HydrusJobStatus } & HydrusVersionResponse>('manage_popups/add_popup', data);
  }

  public updatePopup(data: HydrusJobStatusUpdateRequest) {
    return this.apiPost<{ job_status: HydrusJobStatus } & HydrusVersionResponse>('manage_popups/update_popup', data);
  }

  public dismissPopup(data: {job_status_key: string, seconds?: number}) {
    return this.apiPost<void>('manage_popups/dismiss_popup', data);
  }

  public finishPopup(data: {job_status_key: string, seconds?: number}) {
    return this.apiPost<void>('manage_popups/finish_popup', data);
  }

  public finishAndDismissPopup(data: {job_status_key: string, seconds?: number}) {
    return this.apiPost<void>('manage_popups/finish_and_dismiss_popup', data);
  }

  public cancelPopup(data: {job_status_key: string, seconds?: number}) {
    return this.apiPost<void>('manage_popups/cancel_popup', data);
  }

  public callUserCallablePopup(data: {job_status_key: string}) {
    return this.apiPost<void>('manage_popups/call_user_callable', data);
  }

  public getClientOptions() {
    return this.apiGet<HydrusClientOptions & {services: HydrusServices}>('manage_database/get_client_options');
  }


}
