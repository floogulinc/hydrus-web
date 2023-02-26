import { Pipe, PipeTransform } from '@angular/core';
import byteSize, { ByteSizeOptions } from 'byte-size'

@Pipe({
  name: 'byteSize'
})
export class ByteSizePipe implements PipeTransform {

  transform(value: number, options: ByteSizeOptions = {}): unknown {
    return byteSize(value, options);
  }

}
