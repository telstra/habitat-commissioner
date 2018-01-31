import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../services/auth.service';

@Injectable()
export class LoginGuard implements CanActivate {

  constructor(
    private router: Router,
    private auth: AuthService
  ) {}

  // navigate the user to the home screen if a valid token is in the local storage
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

      // if theres no token in the local storage, navigate to the login page
      if(!localStorage.getItem('token')) {
        return Observable.of(true);
      }

      // do a token check
      return this.auth.getUser()
      .map(user => {
        // user authenticated
        this.router.navigateByUrl('/home');
        return Observable.of(false);
      })
      .catch(err => {
        // not authenticated
        return Observable.throw(true);
      });
  }
}
