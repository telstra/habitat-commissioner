import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ErrorInterface } from "../models/error.interface";
import { NotificationService } from "../services/notification.service";
import { ErrorModalComponent } from "../modals/error-modal/error-modal.component";
import { CommissionerService } from '../services/commissioner.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  constructor(
    private ns: NotificationService, 
    private modalService: NgbModal,
    private router: Router) { }

  currentError: boolean;

  /**
   * Called once the error modal is closed. If we're not on the login screen and receieve a token expired error then return
   * to the login screen
   */
  resolveError(error: ErrorInterface) {
    this.currentError = false;
    if(this.router.url !== 'login' && error.error && error.error.name == 'TokenExpiredError') {
      localStorage.removeItem('token');
      this.router.navigateByUrl('/login');
    }
  }

  /**
   * Subscribe to errorOccured events from the notification service and display a modal when one is picked up
   */
  ngOnInit() {
    this.ns.errorOccured.subscribe(async (error: ErrorInterface) => {
      // only display one modal at a time. If an error is already being displayed the dont display another one
      if (!this.currentError) {
        try {
          this.currentError = true;
          // instantiate the modal
          const modalRef = this.modalService.open(ErrorModalComponent, { size: 'lg', backdrop: 'static', keyboard: false });
          modalRef.componentInstance.error = error;

          // modal closed
          const result = await modalRef.result;
          if(result) {
            this.resolveError(error);
          }
        }
        catch(e) {
          this.resolveError(error);
        }
      }
    });
  }
}
