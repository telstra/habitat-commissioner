import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UtilsService } from '../services/utils.service';
import { StateService } from '../services/state.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  showApigeePassword: boolean;
  loginLoader: Subscription;

  constructor(
    private auth: AuthService,
    private utils: UtilsService,
    private stateService: StateService,
    private router: Router
  ) { }

  login() {
    if (this.loginForm.valid) {
      this.loginLoader = this.auth.login(this.loginForm.value).flatMap(res => {
        return this.auth.getUser();
      }).subscribe(res => {
        // successfully logged in and got the user
        if(!res.config.apiHostName || !res.config.orgs || !res.config.repoParentDirectory) {
          this.router.navigateByUrl('/settings');
        } else { this.router.navigateByUrl('/home'); }
      });
    } else {
      this.utils.setAsTouched(this.loginForm);
    }
  }

  ngOnInit() {
    if(this.stateService.getState().view) {
      this.stateService.view(null);
    }
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }
}