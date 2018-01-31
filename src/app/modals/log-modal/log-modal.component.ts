import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { LogInterface } from "../../models/log.interface";

/**
 * Display detailed information from a log
 * 
 * For more information on ng-bootstrap modals see https://ng-bootstrap.github.io/#/components/modal/examples
 */

@Component({
  selector: 'app-log-modal',
  templateUrl: './log-modal.component.html'
})
export class LogModalComponent {
  @Input() log: LogInterface;

  constructor(public activeModal: NgbActiveModal) {
  }
}