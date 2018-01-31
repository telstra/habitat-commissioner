import { Pipe, PipeTransform } from '@angular/core';
import { FuseOptions, FuseService } from '../../services/fuse.service';

/**
 * Use fuse.js to perfrom a fuzzy search on array data.
 * Code adapted from ng2-fuse: https://github.com/caiobsouza/ng2-fuse
 * fuse.js: http://fusejs.io/
 */

@Pipe({ name: "fuse" })
export class FusePipe implements PipeTransform {

    constructor(private fuseService: FuseService) { }

    /**
     * The fuzzy search pipe. Returns the result of the search funtion in the fuse service
     * @param collection the array to search in
     * @param searchString the string the user has entered that we try to find a match for
     * @param options Usually an object called keys that holds an array of strings. These strings are keys within the objects in the
     * collection array and theyre values are what we are trying to match
     */
    transform(collection: Array<Object>, searchString: string, options: FuseOptions = {}): any {
        return this.fuseService.search(collection, searchString, options);
    }
}