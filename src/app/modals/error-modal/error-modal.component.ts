import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ErrorInterface } from "../../models/error.interface";

/**
 * Display an error to the user
 * 
 * For more information on ng-bootstrap modals see https://ng-bootstrap.github.io/#/components/modal/examples
 */

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html'
})
export class ErrorModalComponent {
  @Input() error: ErrorInterface;
  
  constructor(public activeModal: NgbActiveModal) {}
}