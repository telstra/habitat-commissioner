import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Router } from '@angular/router';

import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { UserInterface } from '../models/user.interface';
import { ApigeeResponseInterface } from '../models/apigee-response.interface';
import { NotificationService } from './notification.service';

/**
 * All API calls relating to the user
 */

@Injectable()

export class AuthService {

  // initialize the user object
  user = {} as UserInterface;

  constructor(
    private http: Http,
    private router: Router,
    private ns: NotificationService
  ) {
  }

  // handle errors from the API
  handleError(error) {
    this.ns.handleError(error);
    return Observable.throw(error);
  }

  // handle responses from the API
  handleResponse(response) {
    this.ns.handleToast(response);
    return response;
  }

  // get token from local storage
  token() {
    return localStorage.getItem('token');
  }

  /**
   * Login to the HC API
   * @param loginDetails username and password
   */
  login(loginDetails) {
    const body = `username=${loginDetails.username}&password=${loginDetails.password}`
    const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });

    return this.http.post('/auth/login', body, { headers: headers })
      .map((response: Response) => {
        localStorage.setItem('token', response.json().data.token);
        return this.handleResponse(response.json());
      })
      .catch((error: Response) => {
        return this.handleError(error.json());
      })
  }

  /**
   * Get details of the current user
   */
  getUser(): Observable<UserInterface> {
    const headers = new Headers({ token: this.token() });

    return this.http.get('/user', { headers: headers })
      .map((response: Response) => {
        this.user = response.json().data;
        return response.json().data;
      })
      .catch((error: Response) => {
        this.ns.handleError(error.json());
        return Observable.of(false);
        //return this.handleError(error.json());
      })
  }

  /**
   * Update the current user configuration
   * @param data update data
   */
  updateUser(data): Observable<UserInterface> {
    const body = JSON.stringify(data);
    const headers = new Headers({
      token: this.token(),
      ['Content-Type']: 'application/json'
    });

    return this.http.put('/user', body, { headers: headers })
      .map((response: Response) => {
        this.user = response.json().data;
        return this.handleResponse(response.json());
      })
      .catch((error: Response) => {
        return this.handleError(error.json());
      })
  }

  /**
   * Update user proxy settings
   * @param data proxy data
   */
  updateProxy(data): Observable<UserInterface> {
    const body = JSON.stringify(data);
    const headers = new Headers({
      token: this.token(),
      ['Content-Type']: 'application/json'
    });

    return this.http.put('/user/proxy', body, { headers: headers })
      .map((response: Response) => {
        this.user = response.json().data;
        return this.handleResponse(response.json());
      })
      .catch((error: Response) => {
        return this.handleError(error.json());
      })
  }

  /**
   * Enable SSL for the user
   * @param formData passphrase, if needed, and key and cert files
   */
  enableSSL(formData): Observable<ApigeeResponseInterface> {
    const headers = new Headers({ token: this.token() });

    return this.http.post('/user/ssl', formData, { headers: headers })
      .map((response: Response) => {
        return this.handleResponse(response.json());
      })
      .catch((error: Response) => {
        return this.handleError(error.json());
      })
  }

  /**
   * Disable SSL for the user. Also deletes SSL key and cert from the server
   */
  disableSSL(): Observable<ApigeeResponseInterface> {
    const headers = new Headers({ token: this.token() });

    return this.http.delete('/user/ssl', { headers: headers })
      .map((response: Response) => {
        return this.handleResponse(response.json());
      })
      .catch((error: Response) => {
        return this.handleError(error.json());
      })
  }

  /**
   * Get a postman test by ID
   * @param id Postman test suite ID
   */
  getTests(id): Observable<ApigeeResponseInterface> {
    const headers = new Headers({ token: this.token() });

    return this.http.get(`/user/tests/${id}`, { headers: headers })
      .map((response: Response) => {
        return response.json();
      })
      .catch((error: Response) => {
        return this.handleError(error.json());
      })
  }

  /**
   * Upload a new postman test suite
   * @param formData Postman collection and environment
   */
  createPostmanTest(formData): Observable<ApigeeResponseInterface> {
    const headers = new Headers({ token: this.token() });

    return this.http.post('/user/tests', formData, { headers: headers })
      .map((response: Response) => {
        return this.handleResponse(response.json());
      })
      .catch((error: Response) => {
        return this.handleError(error.json());
      })
  }

  /**
   * Update an existing postman test suite
   * @param id Test suite ID
   * @param formData Postman collection and environment
   */
  updatePostmanTest(id, formData): Observable<ApigeeResponseInterface> {
    const headers = new Headers({ token: this.token() });

    return this.http.put(`/user/tests/${id}`, formData, { headers: headers })
      .map((response: Response) => {
        return this.handleResponse(response.json());
      })
      .catch((error: Response) => {
        return this.handleError(error.json());
      })
  }

  /**
   * Delete a postman test suite
   * @param id Test suite ID
   */
  deletePostmanTest(id): Observable<ApigeeResponseInterface> {
    const headers = new Headers({ token: this.token() });

    return this.http.delete(`/user/tests/${id}`, { headers: headers })
      .map((response: Response) => {
        return this.handleResponse(response.json());
      })
      .catch((error: Response) => {
        return this.handleError(error.json());
      })
  }

  /**
   * Get all directory names in the users parent repo
   */
  getRepos() {
    const headers = new Headers({ token: this.token() });

    return this.http.get('/user/repos', { headers: headers })
      .map((response: Response) => {
        return response.json().data;
      })
      .catch((error: Response) => {
        return this.handleError(error.json());
      })
  }

  /**
   * Delete the current user
   */
  deleteUser() {
    const headers = new Headers({ token: this.token() });

    return this.http.delete(`/user`, { headers: headers })
      .map((response: Response) => {
        return this.handleResponse(response.json());
      })
      .catch((error: Response) => {
        return this.handleError(error.json());
      })
  }

  /**
   * Logout of the HC front end. Doesnt really do anything on the server side. Removes the token from local storage and navigates
   * the user back to the login screen
   */
  logout() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');
  }

}