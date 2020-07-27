import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Result, Response } from 'sagiri/dist/response';
import sites from 'sagiri/dist/sites';
import { SagiriResult, Options } from 'sagiri/dist/index';
import { resolveResult } from 'sagiri/dist/util';
import { SagiriClientError, SagiriServerError } from 'sagiri/dist/errors';
import { map } from 'rxjs/operators';

interface SacuenaoOptions {
  numres?: string;
  output_type?: '0' | '2';
  api_key?: string;
  testmode?: '1' | null;
  dbmask?: string;
  dbmaski?: string;
  db?: string;
}

const defaultSaucenaoOptions: SacuenaoOptions = {
  db: '999',
  output_type: '2',
  numres: '3',
}

@Injectable({
  providedIn: 'root'
})
export class SaucenaoService {

  constructor(private http: HttpClient) { }

  public searchResponse(url: string, options?: SacuenaoOptions): Observable<Response> {
    return this.http.get<Response>('https://cors-anywhere.herokuapp.com/' + 'https://saucenao.com/search.php?db=999&output_type=2', {
      params: {
        ...defaultSaucenaoOptions,
        ...options,
        url
      }
    }).pipe(
      catchError(err => {
        if(!err.error.header) {
          throw err;
        }
        const {
          header: { status, message},
        } = err.error;

        if (status > 0) {
          // Server side error
          throw new SagiriServerError(status, message);
        } else if (status < 0) {
          // Client side error
          throw new SagiriClientError(status, message);
        }
        return of(null);
      }),
      map(res => {
        const {
          header: { status, message},
        } = res;
        if (status > 0) {
          // Server side error
          throw new SagiriServerError(status, message);
        } else if (status < 0) {
          // Client side error
          throw new SagiriClientError(status, message);
        }

        return res;
      }),
    );
  }

  public searchResults(url: string, options?: SacuenaoOptions): Observable<Result[]> {
    return this.searchResponse(url, options).pipe(
      map(resp => resp.results.filter(({ header: { index_id: id } }) => !!sites[id])
      .sort((a, b) => b.header.similarity - a.header.similarity))
    );
  }

  // Adapted from https://github.com/ClarityCafe/Sagiri
  public search(url: string, options?: SacuenaoOptions): Observable<SagiriResult[]> {
    return this.searchResults(url, options).pipe(
      map(results => results.map(result => {
        const { url, name, id, authorName, authorUrl } = resolveResult(result);
        const {
          header: { similarity, thumbnail },
        } = result;

        return {
          url,
          site: name,
          index: (id as any) as number, // These are actually numbers but they're typed as strings so they can be used to select from the sites map
          similarity: Number(similarity),
          thumbnail,
          authorName,
          authorUrl,
          raw: result,
        };
      }))
    );
  }

}
