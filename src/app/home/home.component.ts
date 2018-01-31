import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommissionerService } from '../services/commissioner.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UtilsService } from '../services/utils.service';
import { StateInterface } from '../models/state.interface';
import { StateService } from '../services/state.service';
import { Subscription } from 'rxjs';
import { ApigeeResponseInterface } from '../models/apigee-response.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

/**
 * Main component for the habitat commissioner API. Encapsulates the sidebar, header, item details, item details and visualization
 * components
 */

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  stateSubscriber: Subscription;  // subscribe to changes of the state behaviour subject in the state service
  menuActive: boolean;
  itemLoading: boolean;
  showVisuals: boolean;

  log: boolean = true;

  constructor(
    private cs: CommissionerService,
    private stateService: StateService,
    private utils: UtilsService,
    private modalService: NgbModal
  ) { }

  toggleMenu() {
    this.menuActive = !this.menuActive;
  }

  toggleVisuals() {
    this.showVisuals = !this.showVisuals;
  }

  // scrollTo(target) {
  //   target.scrollIntoView();
  // }

  viewLog() {
    this.log = !this.log;
  }

  addToQueue(type) {
    this.stateService.queue(type);
  }

  // get a queue from the state service. For passing into the ItemQueues component
  queue(type) {
    return this.state()[`${type}_queue`];
  }

  // return the current value of the state
  state() {
    return this.stateService.getState();
  }

  // get the item display name
  displayName(item?) {
    return this.stateService.getDisplayName(item);
  }

  ngOnInit() {
  }
}
