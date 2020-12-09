import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Result, Response } from 'sagiri/dist/response';
import sites from 'sagiri/dist/sites';
import { resolveResult } from 'sagiri/dist/util';
import { SagiriClientError, SagiriServerError } from 'sagiri/dist/errors';
import { map, catchError } from 'rxjs/operators';

// from https://github.com/ClarityCafe/Sagiri/blob/master/lib/index.ts#L147-L156
interface SagiriResult {
  url: string;
  site: string;
  index: number;
  similarity: number;
  thumbnail: string;
  authorName: string | null;
  authorUrl: string | null;
  raw: Result;
}

interface SacuenaoOptions {
  numres?: string;
  output_type?: '0' | '2';
  api_key?: string;
  testmode?: '1' | null;
  dbmask?: string;
  dbmaski?: string;
  db?: string;
}

export interface SaucenaoResults extends SagiriResult {
  urls: {
    site: string;
    url: string;
  }[];
}

const defaultSaucenaoOptions: SacuenaoOptions = {
  db: '999',
  output_type: '2',
  numres: '5',
};

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

  public filteredSearchResponse(url: string, options?: SacuenaoOptions, minSimilarity: number = 70): Observable<Result[]> {
    return this.searchResponse(url, options).pipe(
      map(resp => resp.results.filter(({ header: { index_id: id, similarity}}) => !!sites[id] && similarity >= minSimilarity)
      .sort((a, b) => b.header.similarity - a.header.similarity))
    );
  }

  // Adapted from https://github.com/ClarityCafe/Sagiri
  public search(url: string, options?: SacuenaoOptions): Observable<SaucenaoResults[]> {
    return this.filteredSearchResponse(url, options).pipe(
      map(results => results.map(result => {
        const { url, name, id, authorName, authorUrl } = resolveResult(result);
        const {
          header: { similarity, thumbnail },
        } = result;

        const urls = (result.data.ext_urls ?? [url]).map(url => ({
          site: Object.values(sites).find(site => site.urlMatcher.test(url))?.name ?? 'Unknown',
          url
        }));

        return {
          url,
          site: name,
          index: (id as any) as number, // These are actually numbers but they're typed as strings so they can be used to select from the sites map
          similarity: Number(similarity),
          thumbnail,
          authorName,
          authorUrl,
          raw: result,
          urls
        };
      }))
    );
  }

}
