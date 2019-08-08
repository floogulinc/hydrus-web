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


  private getHeaders() : HttpHeaders {
    return new HttpHeaders({
      "Hydrus-Client-API-Access-Key" : this.hydrusApiKey
    });
  }

  public testApi(): Observable<HydrusKeyVerificationData> {
    return this.http.get<HydrusKeyVerificationData>(this.hydrusApiUrl + "verify_access_key", {
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
    console.log(tags);
    let httpParams: HttpParams = new HttpParams().set("tags", tags);
    if(system_inbox) httpParams = httpParams.set("system_inbox", system_inbox);
    if(system_archive) httpParams = httpParams.set("system_archive", system_archive);
    console.log(httpParams);
    return this.http.get(this.hydrusApiUrl + "get_files/search_files", {
      params: httpParams,
      headers: this.getHeaders()
    });
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
    
    return this.http.get(this.hydrusApiUrl + "get_files/file_metadata", {
      params: httpParams,
      headers: this.getHeaders()
    });
  }

  public getFileURL(file_id: number): string {
    return this.hydrusApiUrl + 'get_files/file?file_id=' + file_id + '&Hydrus-Client-API-Access-Key=' + this.hydrusApiKey;
  }

  public getThumbnailURL(file_id: number): string {
    return this.hydrusApiUrl + 'get_files/thumbnail?file_id=' + file_id + '&Hydrus-Client-API-Access-Key=' + this.hydrusApiKey
  }




}
