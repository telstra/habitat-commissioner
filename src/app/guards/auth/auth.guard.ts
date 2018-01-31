import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private auth: AuthService
  ) { }

  // check the token in local storage every time we change routes. If the token is no longer valid then navigate to the login screen.
  // The token check will also cause the notificationService to emit an error on failure.
  // This guard is not applied to the login screen
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    // if theres no token in the local storage, navigate to the login page
    if (!localStorage.getItem('token')) {
      this.router.navigateByUrl('/login');
      return Observable.of(true);
    }

    // do a token check
    return this.auth.getUser()
      .map(user => {
        // console.log(user);
        if(!user) {
          // not authenticated
          localStorage.removeItem('token');
          this.router.navigateByUrl('/login');
          return Observable.of(false);
        }
        // user authenticated
        return true;
      })
      .catch(err => {
        // error
        localStorage.removeItem('token');
        this.router.navigateByUrl('/login');
        return Observable.throw(false);
      })
  }
}
