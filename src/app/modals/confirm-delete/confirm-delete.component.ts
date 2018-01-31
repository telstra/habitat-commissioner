import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StateService } from '../../services/state.service';

/**
 * Confirm deletion of an item before acutally deleting it
 * 
 * For more information on ng-bootstrap modals see https://ng-bootstrap.github.io/#/components/modal/examples
 */

@Component({
  selector: 'app-confirm-delete-modal',
  templateUrl: './confirm-delete.component.html'
})
export class ConfirmDeleteModalComponent {
  item: any;

  constructor(public activeModal: NgbActiveModal, private state: StateService) {}

  getDisplayName() {
    if (this.item.parent && this.item.base === 'proxies') {
      return `revision ${this.item.data.revision}`;
    } else if (this.item.parent && this.item.base === 'sharedFlows') {
      return `revision ${this.item.data.name}`;
    } else {
      return this.state.getDisplayName();
    }
  }
}