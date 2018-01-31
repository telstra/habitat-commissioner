import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommissionerService } from '../../services/commissioner.service';
import { Subscription } from 'rxjs/Subscription';

/**
 * Modal displayed when the user chooses to add a new product to a package via the options button when viewing 
 * packages in the Apigee view.
 * 
 * For more information on ng-bootstrap modals see https://ng-bootstrap.github.io/#/components/modal/examples
 */

@Component({
  selector: 'app-add-product-to-package-modal',
  templateUrl: './add-product-to-package.component.html'
})
export class AddProductToPackageModalComponent implements OnInit {
  displayName: string;
  options: string[];
  loading: Subscription;
  selected = {};
  
  constructor(
    public activeModal: NgbActiveModal,
    private cs: CommissionerService
  ) {}

  close() {
    let results = [];
    Object.keys(this.selected).forEach(key => {
      if(this.selected[key]) {
        results.push(key);
      }
    });
    this.activeModal.close(results);
  }

  ngOnInit() {
    // get the api products from apigee
    this.loading = this.cs.basicGet(`/apiProducts/apigee/list`).subscribe(res => {
      this.options = res.data;
    }, error => console.error(error));
  }
}