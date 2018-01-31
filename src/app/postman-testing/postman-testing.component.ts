import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Animations } from '../animations/animations';
import { CommissionerService } from '../services/commissioner.service';

/**
 * Run postman tests the user has uploaded
 */

@Component({
  selector: 'app-postman-testing',
  templateUrl: './postman-testing.component.html',
  styleUrls: ['./postman-testing.component.scss'],
  animations: [Animations.flyInOut]
})
export class PostmanTestingComponent implements OnInit {

  tests: any[];
  selectedTest: any;
  menuActive: boolean;

  // loading object disables buttons of running tests. Allows us to run multiple tests at the same time but not the same
  // ones simultaneously
  loading = {};

  constructor(
    private router: Router,
    private cs: CommissionerService,
    private auth: AuthService
  ) { }

  returnHome() {
    this.router.navigateByUrl('/home');
  }

  runTest(test) {
    if(!this.loading[test.id] || this.loading[test.id] && this.loading[test.id].closed) {
      this.loading[test.id] = this.cs.runPostmanTests(test.id).subscribe(res => {
      }, error => console.error(error));
    }
  }

  ngOnInit() {
    // get the tests
    this.tests = this.auth.user.config.tests;
  }

}
