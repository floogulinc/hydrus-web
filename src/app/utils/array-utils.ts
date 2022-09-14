function *range(a: number, b: number) {
  for (let i = a; i <= b; ++i) { yield i; }
}

export function rangeArray(a: number, b: number): number[] {
  return Array.from(range(a, b));
}

export function chunk<T>(array: T[], size: number): T[][] {
  const chunked = [];
  for (let i = 0; i < array.length; i = i + size) {
    chunked.push(array.slice(i, i + size));
  }
  return chunked;
}

/**
 * In an ngFor directive, don't destroy and re-create the HTML elements every
 * time the list changes.
 *
 * (Abstractly, this function says that an HTML element's "identity" is
 * determined by its position in the list, not by its value.)
 */
export function trackByIndex(index: number, item: any) {
  return index;
}
