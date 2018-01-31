import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { StateInterface } from '../../models/state.interface';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { StateService } from '../../services/state.service';
import { UtilsService } from '../../services/utils.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  // toggle side bar
  @Output() toggleMenu: EventEmitter<void> = new EventEmitter<void>();
  // nav bar collapse
  isCollapsed: boolean = false;
  // repos to display in the dropdown
  repos: string[];
  
  constructor(
    public stateService: StateService,
    public utils: UtilsService,
    public auth: AuthService,
    private router: Router
  ) { }

  // toggle the side bar
  logoClicked() {
    this.toggleMenu.emit();
  }

  // get current state value from the state service
  state() {
    return this.stateService.getState();
  }

  // set header values
  setHeader() {
    this.stateService.clear();
    // get the repos
    this.auth.getRepos().subscribe(res => {
      this.repos = res;
    }); 
  }

  ngOnInit() {
    this.setHeader();
  }

}
