
export interface HydrusTagSearchTag {
  value: string,
  count: number
}

export type HydrusSearchTags = (string | HydrusSearchTags)[];

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
