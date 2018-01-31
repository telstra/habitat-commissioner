import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommissionerService } from '../../services/commissioner.service';
import { Subscription } from 'rxjs/Subscription';

/**
 * Modal displayed when the user chooses to remove an existing product from a package via the options button when viewing 
 * packages in the Apigee view.
 * 
 * For more information on ng-bootstrap modals see https://ng-bootstrap.github.io/#/components/modal/examples
 */

@Component({
  selector: 'app-remove-product-from-package-modal',
  templateUrl: './remove-product-from-package.component.html'
})

export class RemoveProductFromPackageModalComponent implements OnInit {
  item: any;
  selected: string;
  loading: Subscription;
  options: string[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private cs: CommissionerService,
    private modalService: NgbModal,
  ) { }

  close() {
    this.activeModal.close(`/${this.selected}`);
  }

  ngOnInit() {
    // get the products for the package
    this.loading = this.cs.basicGet(`/monetizationPackages/apigee/details/${this.item.id}`).subscribe(res => {
      res.data.product.forEach(p => {
        this.options.push(p.id);
      });
    });
  }
}