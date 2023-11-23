import { HydrusRequestFiles } from "./hydrus-api";

export type HydrusJobStatusAddRequest = {
  status_title?: string,
  status_text_1?: string,
  status_text_2?: string,
  is_cancellable?: boolean,
  is_pausable?: boolean
} & HydrusRequestFiles

export type HydrusJobStatusUpdateRequest = HydrusJobStatusAddRequest & {
  job_status_id: string
}

interface HydrusNetworkJob {
  url: string;
  waiting_on_connection_error: boolean;
  domain_ok: boolean;
  waiting_on_serverside_bandwidth: boolean;
  no_engine_yet: boolean;
  has_error: boolean;
  total_data_used: number;
  is_done: boolean;
  status_text: string;
  current_speed: number;
  bytes_read: number;
  bytes_to_read: number;
}

export interface HydrusJobStatus {
  key: string;
  creation_time: number;
  status_title?: string;
  status_text_1?: string;
  status_text_2?: string;
  traceback?: string;
  had_error: boolean;
  is_cancellable: boolean;
  is_cancelled: boolean;
  is_deleted: boolean;
  is_done: boolean;
  is_pauseable: boolean;
  is_paused: boolean;
  is_working: boolean;
  nice_string?: string;
  popup_gauge_1?: number[];
  popup_gauge_2?: number[];
  attached_files_mergable?: boolean;
  api_data?: object;
  files?: {
    hashes: string[],
    label: string
  };
  user_callable_label?: string;
  network_job?: HydrusNetworkJob;
}

