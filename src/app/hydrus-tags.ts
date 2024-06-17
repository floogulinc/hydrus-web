import { Pipe, PipeTransform } from "@angular/core";

export interface HydrusTagSearchTag {
  value: string,
  count: number
}

export type HydrusSearchTag = string | HydrusSearchTags
export type HydrusSearchTags = HydrusSearchTag[];

export function isSingleTag(searchTag: HydrusSearchTag): searchTag is string {
  return typeof searchTag === 'string';
}

@Pipe({
  name: 'isSingleTag'
})
export class isSingleTagPipe implements PipeTransform {
  transform(searchTag: HydrusSearchTag): searchTag is string {
    return isSingleTag(searchTag);
  }
}

export type TagDisplayType = 'storage' | 'display';

export enum HydrusTagAction {
  Add = 0,
  Delete = 1,
  Pend = 2,
  RescindPend = 3,
  Petition = 4,
  RescindPetition = 5
}

export interface ServiceNamesOrKeysToTags {
  [serviceNameOrKey: string]: string[]
}

export interface ServiceNamesOrKeysToActionsToTags {
  [serviceNameOrKey: string] : {
    [action: string]: string[]
  }
}

export interface TagsToServiceKeysToSiblingsAndParents {
  [tag: string]: {
    [service_key: string]: {
      siblings: string[];
      ideal_tag: string;
      descendants: string[];
      ancestors: string[];
    }
  }
}


export enum HydrusTagDisplayType {
  TAG_DISPLAY_STORAGE = 0,
  TAG_DISPLAY_DISPLAY_ACTUAL = 1,
  TAG_DISPLAY_SINGLE_MEDIA = 2,
  TAG_DISPLAY_SELECTION_LIST = 3,
  TAG_DISPLAY_DISPLAY_IDEAL = 4
}

enum HydrusTagSortType {
  SORT_BY_HUMAN_TAG = 0,
  SORT_BY_HUMAN_SUBTAG = 1,
  SORT_BY_COUNT = 2
}

enum HydrusTagSortOrder {
  SORT_ASC = 0,
  SORT_DESC = 1
}

enum HydrusSortGroupBy {
  GROUP_BY_NOTHING = 0,
  GROUP_BY_NAMESPACE = 1
}

export interface HydrusTagSort {
  sort_type: HydrusTagSortType;
  sort_order: HydrusTagSortOrder;
  use_siblings: boolean;
  group_by: HydrusSortGroupBy;
}
