import { Injectable, EventEmitter } from '@angular/core';
import { ErrorInterface } from "../models/error.interface";
import { ApigeeResponseInterface } from '../models/apigee-response.interface';
import { StateInterface } from '../models/state.interface';

/**
 * Emit events tp be picked up by the error and notification components
 */

@Injectable()

export class NotificationService {

  errorOccured = new EventEmitter<ErrorInterface>();
  showToast = new EventEmitter<ApigeeResponseInterface>();

  // emit the error occured event, picked up by the error component
  handleError(error: ErrorInterface) {
    this.errorOccured.emit(error);
  }
  // emit a toast event, picked up the toast component
  handleToast(toast: ApigeeResponseInterface) {
    this.showToast.emit(toast);
  }

}