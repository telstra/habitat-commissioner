import { Component, OnInit, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommissionerService } from '../../services/commissioner.service';
import { StateService } from '../../services/state.service';
import { ConfirmDeleteModalComponent } from '../../modals/confirm-delete/confirm-delete.component';
import { UtilsService } from '../../services/utils.service';
import { IOption } from '../../models/item-options.interface';
import { NotificationService } from '../../services/notification.service';

/**
 * Buttons for performing CRUD operations on an item. 
 * Not all items have the same options enabled.
 * Some items have a 'more' options. For details on this please see /services/utils.service
 */

@Component({
  selector: 'app-item-button-options',
  templateUrl: './item-button-options.component.html',
  styleUrls: ['./item-button-options.component.scss']
})
export class ItemButtonOptionsComponent implements OnInit, OnChanges {

  // pass in the item as input so we can trigger onChanges, might be more performance friendly too
  @Input() item: any;
  @Output() showVisuals: EventEmitter<void> = new EventEmitter<void>();

  // hide procure button when any of these are the item.base
  hideProcure = ['kvms'];
  // hide update button when these are the item.base
  hideUpdate = ['proxies', 'sharedFlows', 'monetizationPackages', 'kvms'];
  // more options
  options: IOption[];
  // track what operations are loading. Each parameter is an rxjs subscription and updated as the user performs operations
  loaders = {};

  constructor(
    private modalService: NgbModal,
    private cs: CommissionerService,
    private stateService: StateService,
    private utils: UtilsService,
    private ns: NotificationService
  ) { }

  hideProcureButton() {
    // hide for anything with a base in the hideProcure array
    if (this.hideProcure.indexOf(this.item.base) !== -1) {
      return true;
    }
    // hide when rate plan
    if (this.checkRatePlan()) {
      return true;
    }
    // hide when company or developer app
    if(this.checkApp()) {
      return true;
    }
    return false;
  }

  hideUpdateButton() {
    // hide for anything with a base in the hideUpdate array
    if (this.hideUpdate.indexOf(this.item.base) !== -1) {
      return true;
    }
    // hide for company/ developer apps
    if(this.checkApp()) {
      return true;
    }
    return false;
  }

  hideCreateButton() {
    // hide when looking at a rate plan
    if (this.item.data.monetizationPackage) {
      return true;
    }
    // hide for kvm entries
    if (this.checkKvmEntry()) {
      return true;
    }
    // hide for company/ developer apps
    if(this.checkApp()) {
      return true;
    }
    return false;
  }

  hideDeleteButton() {
    // hide when rate plan
    if (this.checkRatePlan()) {
      return true;
    }
    // hide when looking at kvm entry
    if (this.checkKvmEntry()) {
      return true;
    }
    // hide when looking at proxy or shared flow revison
    if ((this.item.base === 'sharedFlows' || this.item.base === 'proxies') && this.item.parent) {
      return true;
    }
    return false;
  }

  // emit show visuals to the home component
  onVisuals() {
    this.showVisuals.emit();
  }

  // delete an item
  async deleteItem() {
    try {
      const result = await this.showDeleteModal();
      if (result) {
        this.loaders[this.getId()] =
          this.cs.apigeeDelete(`/${this.item.base}/${this.item.parent ? this.item.parent + '/' : ''}${this.getId()}`).subscribe(res => {
          }, error => console.error(error));
      }
    } catch (e) { /* close modal and do nothing */ }
  }

  /**
   * Show a modal in which the user can confirm for one last time if they actually want to proceed with the deletion of
   * the selected item or sub item
   * @param hideDetails Flag specifically for confirming deleting of a product from a package. When true, shows a generic
   * confirmation message
   */
  showDeleteModal(hideDetails?: boolean) {
    return new Promise(async (resolve, reject) => {
      try {
        const modalRef = this.modalService.open(ConfirmDeleteModalComponent, { size: 'lg' });
        modalRef.componentInstance.item = hideDetails ? null : this.item;

        const result = await modalRef.result;
        if (result) {
          //this.deleteItem();
          resolve(result);
        } else {
          reject();
        }
      }
      catch (e) { 
        this.resetOptions();
        reject(); 
      }
    });
  }

  // show a modal for the option
  async showOptionModal(option: IOption) {
    try {
      const modalRef = this.modalService.open(option.modal, { size: 'lg' });
      modalRef.componentInstance.displayName = this.getDisplayName();
      modalRef.componentInstance.item = this.state().item.data;
      if(option.metaData) {
        modalRef.componentInstance.metaData = option.metaData;
      }

      const result = await modalRef.result;
      if (result) {
        // if the result starts with a / append it to the option.endpoint
        if (typeof result === 'string' && (result.indexOf('/') === 0)) {
          option.endpoint = `${option.endpoint}${result}`;
        }
        if (Array.isArray(result)) {
          option.payload = result;
        }
        // , Array.isArray(result) ? result : null
        this.executeOption(option);
      }
    }
    catch (e) { /*console.error(e);*/ }
  }

  // execute the option
  async executeOption(option: IOption) {
    try {
      if (option.showDeleteConfirmation) {
        await this.showDeleteModal(option.hideDetailsInDeleteConfirmation);
      }
      this.loaders['options'] = this.cs[`apigee${option.method}`](option.endpoint, option.payload).subscribe(res => {
        this.resetOptions();
      }, error => console.error(error));
    } catch (e) { /* If a delete modal is shown and is closed we will end up here and the delete operation wont be executed*/ }
  }

  // value of the current state
  state() {
    return this.stateService.getState();
  }

  // id of the current itme
  getId() {
    let id = this.stateService.getId();
    if(id.name && id.revision_number) {
      return id.name;
    } else {
      return id;
    }
  }

  // display name of the current item
  getDisplayName() {
    return this.stateService.getDisplayName();
  }

  // add item to a specified queue
  addToQueue(type) {
    this.stateService.queue(type);
  }

  // check if the current item is a developer or company app
  checkApp() {
    return (this.item.base === 'companies' || this.item.base === 'developers') && this.item.parent;
  }

  // check if the current item is a rate plan
  checkRatePlan() {
    return this.item.base === 'monetizationPackages' && this.item.parent;
  }

  // check if the current item is a kvm entry
  checkKvmEntry() {
    return this.item.base === 'kvms' && this.item.parent
  }

  // select which options will be displayed in the 'more' button drop down
  resetOptions() {
    this.options = [];
    // apigee view
    if (this.state().view === 'apigee') {
      // product
      if(this.item.base === 'apiProducts') {
        this.options = this.utils.apigeeApiProductOptions(this.item);
      }
      // package
      if (this.item.base === 'monetizationPackages' && !this.item.parent) {
        this.options = this.utils.apigeePackagesOptions(this.item);
      }
      // rate plan
      else if (this.checkRatePlan()) {
        this.options = this.utils.apigeeRatePlanOptions(this.item);
      }
      // kvm entry
      else if (this.item.base === 'kvms' && this.item.parent) {
        this.options = this.utils.apigeeKvmEntryOptions(this.item);
      }
      // proxy/ shared flow revision
      else if ((this.item.base === 'proxies' || this.item.base === 'sharedFlows') && this.item.parent) {
        this.options = this.utils.apigeeRevisionOptions(this.item);
      }
    }
    // repo view
    else {
      // rate plan
      if (this.checkRatePlan()) {
        this.options = this.utils.repoRatePlanOptions(this.item);
      }
      // kvm entry
      else if (this.item.base === 'kvms' && this.item.parent) {
        this.options = this.utils.repoKvmEntryOptions(this.item);
      }
      // company/ developer app
      else if(this.checkApp()) {
        this.options = this.utils.repoAppOptions(this.item);
      }
    }
  }

  ngOnChanges(change) {
    if(this.item) {
      this.resetOptions();
    }
  }

  ngOnInit() {
  }

}
