import { Pipe, PipeTransform } from '@angular/core';
import { HydrusFile, ServiceNamesToStatusesToTags } from '../hydrus-file';
import { HydrusSearchTag, HydrusSearchTags } from '../hydrus-tags';


export function getNamespace(tag: string): string {
  if (!tag?.includes(':')) { return ''; }
  if (tag.startsWith('-')) {
    tag = tag.substring(1);
  }
  return tag.split(':')[0].toLowerCase();
}

export function getNamespaceNoSpace(tag: string): string {
  if (!tag?.includes(':')) { return ''; }
  if (tag.startsWith('-')) {
    tag = tag.substring(1);
  }
  return tag.split(':')[0].replace(/\s+/g, '-').toLowerCase();
}

export function tagsObjectFromFile(file: HydrusFile): ServiceNamesToStatusesToTags {
  return file.service_names_to_statuses_to_display_tags ?? file.service_names_to_statuses_to_tags;
}


export function allTagsFromFile(file: HydrusFile): string[] {
  return this.allKnownTags(this.tagsObjectFromFile(file));
}

function allKnownTags(serviceNamesTostatusesToTags: ServiceNamesToStatusesToTags) {
  if (serviceNamesTostatusesToTags
    && 'all known tags' in serviceNamesTostatusesToTags
    && '0' in serviceNamesTostatusesToTags['all known tags']) {
    return serviceNamesTostatusesToTags['all known tags']['0'];
  } else {
    return [];
  }
}

export function namespaceTagFromFile(file: HydrusFile, namespace: string): string {
  return allTagsFromFile(file).find(a => getNamespace(a) === namespace);
}

export function getTagValue(tag: string) {
  if (!tag) {
    return tag;
  }
  if (tag.startsWith('-')) {
    tag = tag.substring(1);
  }
  if (!tag.includes(':')) { return tag; }
  return tag.split(':')[1].toLowerCase();
}

function getTagNamespace(tag: string) {
  return `tag-namespace-${getNamespaceNoSpace(tag)}`;
}

@Pipe({
  name: 'tagClass'
})
export class TagNamespaceClassPipe implements PipeTransform {
  transform(tag: string): string {
    return getTagNamespace(tag);
  }
}

export function serviceNamesToCurrentTags(
  service_names_to_statuses_to_tags: ServiceNamesToStatusesToTags,
) {
  return Object.fromEntries(
    Object.entries(service_names_to_statuses_to_tags).map(([key, value]) => [
      key,
      value[0],
    ]),
  );
}

export function isSystemPredicate(tag: string) {
  return getNamespace(tag) === 'system';
}

export function searchTagsContainsSystemPredicate(searchTags: HydrusSearchTag) {
  if (typeof searchTags === 'string') {
    return isSystemPredicate(searchTags);
  } else {
    return searchTags.find(searchTagsContainsSystemPredicate);
  }
}
