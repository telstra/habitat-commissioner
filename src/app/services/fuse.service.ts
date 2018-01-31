import { Injectable } from '@angular/core';
import * as Fuse from 'fuse.js';

/**
 * Use fuse.js to perfrom a fuzzy search on array data.
 * Code adapted from ng2-fuse: https://github.com/caiobsouza/ng2-fuse
 * fuse.js: http://fusejs.io/
 */

export interface FuseOptions extends Fuse.FuseOptions { }

@Injectable()
export class FuseService {
  // our fuzzy search options, we dont let the user define their own
  defaults: FuseOptions = {
    shouldSort: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1
  }

  searchOptions: FuseOptions = this.defaults;

  constructor() { };

  /**
   * Use fuse.js to perform a fuzzy search on an array. We only do this if the collection is not undefined and we have a search string
   * @param collection the array to search in
   * @param searchString the string the user has entered that we try to find a match for
   * @param options Usually an object called keys that holds an array of strings. These strings are keys within the objects in the
   * collection array and theyre values are what we are trying to match
   */
  search(collection: Array<Object>, searchString: string, options: FuseOptions = {}) {
    Object.assign(this.searchOptions, this.defaults, options);

    let results = [];
    if (collection && searchString) {
      const fuse = new Fuse(collection, this.searchOptions);
      results = fuse.search(searchString);

      // when the collection is just an array of strings it will return an array of the matching indices. When this happens we need to map
      // it back to the values in the original collection. We never have arrays of numbers in this app, so its probably fine not to worry
      // about when that happens
      if(typeof results[0] === 'number') {
        results = results.map(x => collection[x]);
      }

      return results;
    } else {
      return collection;
    }
  };
}