import { Injectable } from '@angular/core';
import {ngxLocalStorage} from 'ngx-localstorage';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

export interface HydrusKeyVerificationData {
  basic_permissions: number[];
  human_description: string;
}


@Injectable({
  providedIn: 'root'
})
export class HydrusApiService {


  @ngxLocalStorage({prefix: environment.localStoragePrefix})
  hydrusApiUrl: string;

  @ngxLocalStorage({prefix: environment.localStoragePrefix})
  hydrusApiKey: string;

  constructor(private http: HttpClient) { }


  public getAPIUrl(): string {
    return this.hydrusApiUrl + (this.hydrusApiUrl.endsWith("/") ? "" : "/");
  }

  private getHeaders() : HttpHeaders {
    return new HttpHeaders({
      "Hydrus-Client-API-Access-Key" : this.hydrusApiKey
    });
  }

  private apiGet(path: string, params?: HttpParams) {
    return this.http.get(this.getAPIUrl() + path, {
      params: params,
      headers: this.getHeaders()
    });
  }

  public testApi(): Observable<HydrusKeyVerificationData> {
    return this.http.get<HydrusKeyVerificationData>(this.getAPIUrl() + "verify_access_key", {
      headers: this.getHeaders()
    });
  }


  /**
   * GET /get_files/search_files
   *
   * Search for the client's files.
   * @param tags (a list of tags you wish to search for)
   * @param [system_inbox] true or false (optional, defaulting to false)
   * @param [system_archive] true or false (optional, defaulting to false)
   * @returns The full list of numerical file ids that match the search.
   */
  public searchFiles(tags: string, system_inbox?: string, system_archive?: string) {
    let httpParams: HttpParams = new HttpParams().set("tags", tags);
    if(system_inbox) httpParams = httpParams.set("system_inbox", system_inbox);
    if(system_archive) httpParams = httpParams.set("system_archive", system_archive);
    return this.apiGet("get_files/search_files", httpParams);
  }

  /**
   * GET /get_files/file_metadata
   *
   * Get metadata about files in the client.
   * @param [file_ids] (a list of numerical file ids)
   * @param [hashes] (a list of hexadecimal SHA256 hashes)
   * @param [only_return_identifiers] true or false (optional, defaulting to false)
   * @returns  A list of JSON Objects that store a variety of file metadata.
   */
  public getFileMetadata(file_ids?: string, hashes?: string, only_return_identifiers?: string) {
    let httpParams: HttpParams = new HttpParams();
    if(file_ids) httpParams = httpParams.set("file_ids", file_ids);
    if(hashes) httpParams = httpParams.set("hashes", hashes);
    if(only_return_identifiers) httpParams = httpParams.set("only_return_identifiers", only_return_identifiers);

    return this.apiGet("get_files/file_metadata", httpParams);
  }

  public getFileURL(file_id: number): string {
    return this.getAPIUrl() + 'get_files/file?file_id=' + file_id + '&Hydrus-Client-API-Access-Key=' + this.hydrusApiKey;
  }

  public getThumbnailURL(file_id: number): string {
    return this.getAPIUrl() + 'get_files/thumbnail?file_id=' + file_id + '&Hydrus-Client-API-Access-Key=' + this.hydrusApiKey
  }

  public getPages() {
    return this.apiGet("manage_pages/get_pages");
  }

  public getPageInfo(page_key: string, simple: string) {
    let httpParams: HttpParams = new HttpParams().set("page_key", page_key);
    if(simple) httpParams = httpParams.set("simple", simple);
    return this.apiGet("manage_pages/get_page_info", httpParams);
  }




}
