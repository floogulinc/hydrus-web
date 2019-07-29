export interface HydrusFile {
    file_id: number;
    hash: string;
    size: number;
    mime: string;
    width: number;
    height: number;
    duration?: number;
    num_frames?: number;
    num_words?: number;
    service_tags: {
        (service : string) : {
            (status: string) : [string]
        }
    }
}

export interface HydrusFileList {
    [file_id : number] : HydrusFile;
}
