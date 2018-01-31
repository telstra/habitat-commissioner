import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'keys'
})
export class KeysPipe implements PipeTransform {

  transform(value: any, args: any[] = null): any {
    // return the object keys for the passed in value
    return Object.keys(value);
  }
}