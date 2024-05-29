import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'byte'
})
export class BytePipe implements PipeTransform {
  private unit = 'Bytes';

  transform(value: string | number, decimals?: number | string): string {
    value = value.toString();
    if (parseInt(value, 10) >= 0) {
      value = this.formatBytes(+value, +decimals);
    }
    return value;
  }

  // https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
  formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) { return '0 Bytes'; }

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}
