export interface HydrusFile {
    file_id: number;
    hash: string;
    size: number;
    mime: string;
    width: number;
    height: number;
    has_audio: boolean;
    known_urls: string[];
    duration?: number | null;
    num_frames?: number | null;
    num_words?: number | null;
    service_names_to_statuses_to_tags: {
        [service : string] : {
            [status: string] : string[];
        }
    }
}

export interface HydrusFileList {
    [file_id : number] : HydrusFile;
}
