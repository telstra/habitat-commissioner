import { Injectable, EventEmitter } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Router } from '@angular/router';

import 'rxjs/Rx';
import { Observable, BehaviorSubject } from 'rxjs';

import * as io from 'socket.io-client';
import { LogInterface } from "../models/log.interface";
import { NotificationService } from "./notification.service";
import { StateInterface } from '../models/state.interface';
import { StateService } from './state.service';

/**
 * Most HC API calls happen here
 */

@Injectable()

export class CommissionerService {

  // set up for socket IO so we can display logs to the screen
  private socket;
  private hostURL = window.location.origin;

  constructor(
    private http: Http,
    private router: Router,
    private ns: NotificationService,
    private stateService: StateService
  ) {
    this.socket = io(this.hostURL);
  }

  // handle any errors returning from the API
  handleError(error) {
    this.ns.handleError(error);
    return Observable.throw(error);
  }

  // handle responses from the API
  handleResponse(response) {
    this.ns.handleToast(response);
    return response;
  }

  // navigate to a specified destination path
  navigate(dest) {
    this.router.navigateByUrl(dest);
  }

  // construct the query params for a request using values from the stateService
  getQuery() {
    let state = this.stateService.state$.getValue();
    return state ? `?org=${state.org ? state.org : ''}&env=${state.env || ''}&repo=${state.repo || ''}`
      : '';
  }

  // return the token from local storage
  token() {
    return localStorage.getItem('token');
  }

  // GET 
  basicGet(endpoint) {
    const headers = new Headers({ token: this.token() });

    return this.http.get(`${endpoint}${this.getQuery()}`, { headers: headers })
      .map((response: Response) => {
        return response.json();
      })
      .catch((error: Response) => {
        return this.handleError(error.json());
      })
  }

  // POST
  basicPost(endpoint, content) {
    const body = JSON.stringify(content);
    const headers = new Headers({ token: this.token(), 'Content-Type': 'application/json' });

    return this.http.post(`${endpoint}${this.getQuery()}`, body, { headers: headers })
      .map((response: Response) => {
        return this.handleResponse(response.json());
      })
      .catch((error: Response) => {
        return this.handleError(error.json());
      })
  }

  // Post calls that access apigee
  apigeePost(endpoint, payload?) {
    const body = JSON.stringify(payload);
    const headers = new Headers({ token: this.token(), 'Content-Type': 'application/json' });

    return this.http.post(`${endpoint}${this.getQuery()}`, body, { headers: headers })
      .map((response: Response) => {
        return this.handleResponse(response.json());
      })
      .catch((error: Response) => {
        //return Observable.throw(error.json());
        return this.handleError(error.json());
      })
  }

  // Put calls that access apigee
  apigeePut(endpoint, payload?) {
    const body = JSON.stringify(payload);
    const headers = new Headers({ token: this.token(), 'Content-Type': 'application/json' });

    return this.http.put(`${endpoint}${this.getQuery()}`, body, { headers: headers })
      .map((response: Response) => {
        return this.handleResponse(response.json());
      })
      .catch((error: Response) => {
        //return Observable.throw(error.json());
        return this.handleError(error.json());
      })
  }

  // delete an item from apigee
  apigeeDelete(endpoint) {
    const headers = new Headers({ token: this.token(), 'Content-Type': 'application/json' });

    return this.http.delete(`${endpoint}${this.getQuery()}`, { headers: headers })
      .map((response: Response) => {
        return this.handleResponse(response.json());
      })
      .catch((error: Response) => {
        //this.ns.handleToast(error.json());
        //return Observable.throw(error.json());
        return this.handleError(error.json());
      })
  }

  // run a specified postman test suite
  runPostmanTests(testId) {
    const headers = new Headers({ token: this.token() });

    return this.http.get(`/api/postman_test/${testId}`, { headers: headers })
      .map((response: Response) => {
        return this.handleResponse(response.json());
      })
      .catch((error: Response) => {
        return this.handleError(error.json());
      })
  }

  // use socket IO to pick up log events from the server. The next event is subscribed too by the log.component
  getLog() {
    let observable = new Observable(observer => {
      this.socket.on('log', (log) => {
        observer.next(log);
      });
      return () => {
        this.socket.disconnect();
      };
    })
    return observable;
  }
}