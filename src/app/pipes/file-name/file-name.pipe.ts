import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileName'
})
export class FileNamePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    // replace hyphens and underscores with spaces
    value = value.replace(/-|_/g, ' ');

    // add a space before every capital letter where a letter appears before it
    value = value.replace(/([A-Z])/g, ' $1');

    // remove everything after the .
    value = value.split('.')[0];

    // lower case the entire string
    value = value.toLowerCase();

    // formatting the API and KVM acronym
    value = value.replace('api ', 'API ');
    value = value.replace('kvms', 'KVMs');

    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
