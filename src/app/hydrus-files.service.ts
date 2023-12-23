import { Injectable } from '@angular/core';
import { HydrusBasicFile, HydrusBasicFileFromAPI, HydrusFile, HydrusFileFromAPI, FileCategory, generateRatingsArray, getFileCategory } from './hydrus-file';
import { Observable, of, forkJoin } from 'rxjs';
import { HydrusApiService } from './hydrus-api.service';
import { map, switchMap, tap } from 'rxjs/operators';
import { HydrusServices } from './hydrus-services';
import { HydrusFiletype, filetypeFromMime, hasThumbnail, isFileHydrusRenderable, mime_string_lookup } from './hydrus-file-mimes';

function chunk<T>(array: T[], size: number): T[][] {
  const chunked = [];
  for (let i = 0; i < array.length; i = i + size) {
    chunked.push(array.slice(i, i + size));
  }
  return chunked;
}

const QUERY_CHUNK_SIZE = 256;


@Injectable({
  providedIn: 'root'
})
export class HydrusFilesService {

  constructor(private api: HydrusApiService) { }

  private allFiles: Map<number, HydrusBasicFile> = new Map<number, HydrusBasicFile>();

  clearFilesCache(): void {
    this.allFiles.clear();
  }

  getFilesCacheSize(): number {
    return this.allFiles.size;
  }

  private getFileMetadataAPI(fileIds: number[]) {
    return this.api.getFileMetadata(
      {
        file_ids: fileIds,
        only_return_identifiers: false,
        only_return_basic_information: false,
        detailed_url_information: true,
        include_notes: true,
      }
    );
  }

  // temp for v556 fix
  private getSemiBasicFileMetadataAPI(fileIds: number[]) {
    return this.api.getFileMetadata(
      {
        file_ids: fileIds,
        only_return_identifiers: false,
        only_return_basic_information: false,
        detailed_url_information: false,
        include_notes: false,
      }
    );
  }

  private getFileMetadataHashAPI(fileHashes: string[]) {
    return this.api.getFileMetadata(
      {
        hashes: fileHashes,
        only_return_identifiers: false,
        only_return_basic_information: false,
        detailed_url_information: true,
        include_notes: true,
      },
      true
    );
  }

  public getRawFileMetadata(hash: string) {
    return this.getFileMetadataHashAPI([hash]).pipe(
      map((value) => value.metadata?.[0])
    )
  }

  private getBasicFileMetadataAPI(fileIds: number[]) {
    return this.api.getFileMetadata(
      {
        file_ids: fileIds,
        only_return_identifiers: false,
        only_return_basic_information: true,
        include_blurhash: true
      });
  }


  private getBasicFileMetadataHashAPI(fileHashes: string[]) {
    return this.api.getFileMetadata(
      {
        hashes: fileHashes,
        only_return_identifiers: false,
        only_return_basic_information: true,
        include_blurhash: true
      });
  }

  private getFileMetadataChunked(fileIds: number[]) {
    return forkJoin(chunk(fileIds, QUERY_CHUNK_SIZE).map(ids => this.getAndProcessFileMetadataChunk(ids))).pipe(
      map(files => files.flat())
    );
  }

  private getAndProcessFileMetadataChunk(fileIds: number[]) {
    return this.getBasicFileMetadataAPI(fileIds).pipe(
      // fix for bug in hydrus v556
      switchMap(v => {
        if (v.hydrus_version === 556) {
          const badFileIDs = v.metadata.filter(f => f.filetype_enum === HydrusFiletype.APPLICATION_UNKNOWN).map(f => f.file_id)
          if (badFileIDs.length > 0) {
            return this.getSemiBasicFileMetadataAPI(badFileIDs).pipe(
              map(({metadata, hydrus_version}) => ({
                metadata: v.metadata.map(f1 => metadata.find(f2 => f2.file_id === f1.file_id) || f1),
                hydrus_version
              }))
            )
          }
        }
        return of(v)
      }),
      map(v => v.metadata.map(i => this.processBasicFileFromAPI(i, v.hydrus_version))),
      tap(v => this.addFilesAndTags(v))
    )
  }

  private getAndAddMetadata(fileIds: number[]): Observable<HydrusBasicFile[]> {
    if (fileIds.length === 0) {
      return of([]);
    }
    return this.getFileMetadataChunked(fileIds);
  }

  private addFilesAndTags(files: HydrusBasicFile[]) {
    files.forEach((file) => {
      this.allFiles.set(file.file_id, file);
    });
  }

  getFileMetadata(fileIds: number[]): Observable<HydrusBasicFile[]> {
    const existingFiles: HydrusBasicFile[] = [];
    const filesToGet: number[] = [];
    for (const id of fileIds) {
      if (this.allFiles.has(id)) {
        existingFiles.push(this.allFiles.get(id));
      } else {
        filesToGet.push(id);
      }
    }
    return forkJoin([of(existingFiles), this.getAndAddMetadata(filesToGet)]).pipe(
      map(([s1, s2]) => [...s1, ...s2]),
      map((files) => {
        return files.sort((a, b) => {
          return fileIds.indexOf(a.file_id) - fileIds.indexOf(b.file_id);
        });
      })
    );
  }

  private basicFileExtraInfo(file: HydrusBasicFileFromAPI, hydrusVersion: number) {
    const file_type = file.filetype_enum ?? filetypeFromMime(file.mime);
    const file_type_string = file.filetype_human ?? (file_type === HydrusFiletype.APPLICATION_UNKNOWN ? file.mime : mime_string_lookup[file_type]);
    const renderable = isFileHydrusRenderable(file_type, hydrusVersion);

    return {
      file_url: this.api.getFileURLFromHash(file.hash),
      thumbnail_url: this.api.getThumbnailURLFromHash(file.hash),
      file_type,
      file_category: getFileCategory(file_type, hydrusVersion),
      file_type_string,
      has_thumbnail: hasThumbnail(file_type),
      ...(renderable ? {render_url: this.api.getRenderedURLFromHash(file.hash)} : {})
    }
  }

  private processFileFromAPI(file: HydrusFileFromAPI, hydrusVersion?: number, services?: HydrusServices): HydrusFile {
    const importTimes = file.file_services.current
              ? Object.values(file.file_services.current)
                  .filter((x) => !!x.time_imported)
                  .map((x) => x.time_imported)
              : [];

    const firstImportTime =
      importTimes.length > 0 ? new Date(Math.min(...importTimes) * 1000) : undefined;

    return {
      ...file,
      ...this.basicFileExtraInfo(file, hydrusVersion),
      time_imported: firstImportTime,
      ratings_array: file.ratings ? generateRatingsArray(file.ratings, services) : undefined
    }
  }

  private processBasicFileFromAPI(file: HydrusBasicFileFromAPI, hydrusVersion: number): HydrusBasicFile {
    return {
      ...file,
      ...this.basicFileExtraInfo(file, hydrusVersion)
    }
  }

  public getFilesById(fileIds: number[]): Observable<HydrusFile[]> {
    if (fileIds.length === 0) {
      return of([]);
    }
    return this.getFileMetadataAPI(fileIds).pipe(
      map(v => v.metadata.map(i => this.processFileFromAPI(i, v.hydrus_version, v.services)))
    );
  }

  public getBasicFilesById(fileIds: number[]): Observable<HydrusBasicFile[]> {
    if (fileIds.length === 0) {
      return of([]);
    }
    return this.getBasicFileMetadataAPI(fileIds).pipe(
      map(v => v.metadata.map(i => this.processBasicFileFromAPI(i, v.hydrus_version)))
    );
  }

  public getBasicFilesByHash(fileHashes: string[]): Observable<HydrusBasicFile[]> {
    if (fileHashes.length === 0) {
      return of([]);
    }
    return this.getBasicFileMetadataHashAPI(fileHashes).pipe(
      map(v => v.metadata.map(i => this.processBasicFileFromAPI(i, v.hydrus_version)))
    );
  }

  public getFilesByHash(fileHashes: string[]): Observable<HydrusFile[]> {
    if (fileHashes.length === 0) {
      return of([]);
    }
    return this.getFileMetadataHashAPI(fileHashes).pipe(
      map(v => v.metadata.map(i => this.processFileFromAPI(i, v.hydrus_version, v.services))),
    );
  }

  public getFileById(fileId: number): Observable<HydrusFile> {
    return this.getFilesById([fileId]).pipe(
      map(files => files[0])
    )
  }

  public getFileByHash(fileHash: string): Observable<HydrusFile> {
    return this.getFilesByHash([fileHash]).pipe(
      map(files => files[0])
    )
  }



  public getFileAsFile(file: HydrusBasicFileFromAPI): Observable<File> {
    return this.api.getFileAsBlob(file.hash).pipe(
      map(b => new File([b], file.hash + file.ext, {type: b.type}))
    );
  }

  public getThumbAsBlob(file: HydrusBasicFileFromAPI): Observable<Blob> {
    return this.api.getThumbAsBlob(file.hash)
  }

  public deleteFile(hash: string, reason: string = 'Hydrus Web'){
    return this.api.deleteFiles({hash, reason});
  }

  public undeleteFile(hash: string){
    return this.api.undeleteFiles({hash});
  }

  public archiveFile(hash: string){
    return this.api.archiveFiles({hash});
  }

  public unarchiveFile(hash: string){
    return this.api.unarchiveFiles({hash});
  }


}
