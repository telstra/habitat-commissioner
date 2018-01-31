import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Router } from '@angular/router';

import 'rxjs/Rx';
import { Observable, BehaviorSubject } from 'rxjs';
import { StateInterface } from '../models/state.interface';
import { NotificationService } from './notification.service';

/**
 * State service uses an rxjs behaviour subject to store the current state of the app. The state object stores what item
 * the user has selected, the type of this item and if it has a parent, if the user is in the repo or apigee view etc. We can 
 * get the value of the state behavious subject at any time but calling this.state$.getValue();
 * 
 * We can subscirbe to the value of this state in other components. Whenever we call .next() on the state$ subject the value of
 * the state is sent out to all subscribers and they can update accordingly. In the app.component we subscribe to this state and
 * use ngClass to update the UI colour scheme, for example.
 * 
 * This class also performs some helper functions for getting the id or display name of the currently selected item and managing
 * the request queues
 */

@Injectable()

export class StateService {
  state$: BehaviorSubject<StateInterface> = new BehaviorSubject<StateInterface>(this.defaultState());
  environments: string[];

  constructor(
    private http: Http,
    private ns: NotificationService
  ) { }

  /**
   * Return the current value of the state
   */
  getState() {
    return this.state$.getValue();
  }

  /**
   * Update the current view value
   * @param view value to assigns the states view value to
   */
  view(view: string) {
    if (this.getState().view !== view) {
      this.resetItemAndQueues();
      this.getState().view = view;

      this.next();
    }
  }

  /**
   * Update the current org value. Makes a call to the API to get the environments for that org also
   * @param org value to assign the states org value to
   */
  org(org: string) {
    if (this.getState().org !== org) {
      this.resetItemAndQueues();
      this.getState().org = org;

      // get the envs for the org
      this.environments = null;
      this.getEnvs().subscribe(res => {
        this.environments = res.reverse();
      }, error => {
        console.error(error);
        this.ns.handleError(error);
      });

      this.next();
    }
  }

  /**
   * Update the env value
   * @param env value to assign the states env value to
   */
  env(env: string) {
    if (this.getState().env !== env) {
      this.resetItemAndQueues();
      this.getState().env = env;
      this.next();
    }
  }

  /**
   * Update the repo value
   * @param repo value to assign the states repo value to
   */
  repo(repo: string) {
    if (this.getState().repo !== repo) {
      this.resetItemAndQueues();
      this.getState().repo = repo;
      this.next();
    }
  }

  /**
   * Update the item.base and item.data values
   * @param base value to assign the states item.base value to
   * @param item value to assign the states item.data value to
   */
  item(base: string, item: any) {
    if (this.getState().item !== item) {
      this.getState().item = { base: base, data: item, parent: this.getState().item ? this.getState().item.parent : null };
      this.next();
    }
  }

  /**
   * Update the item.parent value
   * @param item value to assign the states item.parent value to
   */
  parent(item: any) {
    if (this.getState().item.parent !== item) {
      this.getState().item.parent = item;
      this.next();
    }
  }

  /**
   * Add the current item to a specified queue
   * @param type Queue to add to
   */
  queue(type: string) {
    let id = this.getId();
    // first entry
    if (!this.getState()[`${type}_queue`]) {
      this.getState()[`${type}_queue`] = [{
        base: this.getState().item.base,
        items: id
      }]
    }
    // add to object with existing base
    else if (this.getState()[`${type}_queue`].find(x => x.base === this.getState().item.base)) {
      // dont add duplicates
      if (this.getState()[`${type}_queue`].find(x => x.base === this.getState().item.base).items.indexOf(id) === -1) {
        this.getState()[`${type}_queue`].find(x => x.base === this.getState().item.base).items.push(id);
      }
    }
    // new base
    else {
      this.getState()[`${type}_queue`].push({
        base: this.getState().item.base,
        items: [id]
      });
    }
    this.next();
  }

  // Update and emit the state$ value
  next() {
    this.state$.next(this.getState());
    //console.log(this.getState());
  }

  // reset the states value to their default settings
  clear() {
    this.state$.next(this.defaultState());
  }

  // clear the states item value
  resetItem() {
    this.getState().item = null;
  }

  // clear all requst queues and reset the current item
  resetItemAndQueues() {
    this.getState().item = null;
    this.getState().create_queue = [];
    this.getState().procure_queue = [];
    this.getState().update_queue = [];
  }

  /**
   * Remove an item from a queue
   * @param type Request queue type
   * @param base Item base type
   * @param item The item to remove
   */
  removeFromQueue(type, base, item) {
    this.getState()[`${type}_queue`].find(x => x.base === base).items.splice(this.getState()[`${type}_queue`].find(x => x.base === base).items.indexOf(item), 1);
    this.next();
  }

  /**
   * Clear an entire base category from a specified request queue
   * @param type Request queue type
   * @param base Item base
   */
  clearQueue(type, base) {
    this.getState()[`${type}_queue`].splice(this.getState()[`${type}_queue`].findIndex(x => x.base === base), 1);
  }

  /**
   * Get the display name of the current item
   * @param data If supplied, get the display name from this value instead of the current item
   */
  getDisplayName(data?) {
    if(!this.getState().item && !data) { return null }
    if (!data) { data = this.getState().item.data }

    return data.displayName ?
      data.displayName
      : data.name ?
        data.name && data.sharedFlow ? data.sharedFlow : data.name
        : data.email ?
          data.email
          : data.id ?
            data.id
            : data.SharedFlowBundle ?
              data.SharedFlowBundle.$.name
              : data;
  }

  /**
   * Get the ID of the current item. This value is what will be passed to requests hitting the HC API.
   */
  getId() {
    if (this.getState().view === 'apigee' && (this.getState().item.base === 'proxies' || this.getState().item.base === 'sharedFlows')) {
      if (this.getState().item.base === 'proxies') {
        if (Array.isArray(this.getState().item.data.revision)) {
          // user hasnt picked a revision, so give them the latest one
          return {
            name: this.getState().item.data.name,
            revision_number: this.getState().item.data.revision[this.getState().item.data.revision.length - 1]
          }
        }
        // set up proxy request body
        return {
          name: this.getState().item.data.name,
          revision_number: this.getState().item.data.revision
        }
      } else {
        // set up shared flow request body
        if (!this.getState().item.data.sharedFlow) {
          // user hasnt picked a revision, so we give them the latest revision
          return {
            name: this.getState().item.data.name,
            revision_number: this.getState().item.data.revision[this.getState().item.data.revision.length - 1]
          }
        }
        return {
          name: this.getState().item.data.sharedFlow,
          revision_number: this.getState().item.data.name
        }
      }
    } else {
      let data = this.getState().item.data;
      return data.id ?
        data.id
        : data.name ?
          data.name
          : data.email ?
            data.email
            : data.SharedFlowBundle ?
              data.SharedFlowBundle.$.name
              : data;
    }
  }

  // default value for the state behaviour subject
  defaultState() {
    return {
      view: null,
      org: null,
      env: null,
      repo: null,
      item: null,
      create_queue: [],
      update_queue: [],
      procure_queue: []
    }
  }

  // get environments for the current org from the HC API
  getEnvs() {
    const headers = new Headers({ token: localStorage.getItem('token') });
    return this.http.get(`/api/env/${this.getState().org}`, { headers: headers })
      .map((response: Response) => {
        return response.json().data
      })
      .catch((error: Response) => {
        return Observable.throw(error.json());
      });
  }
}