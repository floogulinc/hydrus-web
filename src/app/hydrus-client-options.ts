import { HydrusMediaSort, HydrusMediaSortNamespaces } from "./hydrus-sort";
import { HydrusTagSort } from "./hydrus-tags";



export interface HydrusClientOptions {
  old_options: {
    namespace_colours: Record<string, [number, number, number]>
    [key: string]: any
  };
  options: {
    booleans: Record<string, boolean>;
    strings: Record<string, string>;
    noneable_strings: Record<string, string | null>;
    integers: Record<string, number>;
    noneable_integers: Record<string, number | null>;
    keys: Record<string, string>;
    colors: {
      default: Record<string, [number, number, number]>;
      darkmode: Record<string, [number, number, number]>;
    };
    media_zooms: Array<number>;
    slideshow_durations: Array<number>;
    default_file_import_options: Record<string, string>;
    default_namespace_sorts: Array<HydrusMediaSortNamespaces>;
    default_sort: HydrusMediaSort;
    default_tag_sort: HydrusTagSort;
    default_tag_sort_search_page: HydrusTagSort;
    default_tag_sort_search_page_manage_tags: HydrusTagSort;
    default_tag_sort_media_viewer: HydrusTagSort;
    default_tag_sort_media_vewier_manage_tags: HydrusTagSort;
    fallback_sort: HydrusMediaSort;
    suggested_tags_favourites: Record<string, Array<string>>;
    default_local_location_context: {
      current_service_keys: Array<string>;
      deleted_service_keys: Array<string>;
    }
  }
}
