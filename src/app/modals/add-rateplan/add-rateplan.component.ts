import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs/Subscription';
import { CommissionerService } from '../../services/commissioner.service';

/**
 * Modal displayed when the user chooses to add a new rate plan to a package via the options button when viewing 
 * packages in the Apigee view.
 * 
 * For more information on ng-bootstrap modals see https://ng-bootstrap.github.io/#/components/modal/examples
 */

@Component({
  selector: 'app-add-rateplan-modal',
  templateUrl: './add-rateplan.component.html'
})
export class AddRatePlanModalComponent implements OnInit {
  item: any;
  options: any[] = [];
  selected = {};
  loading: Subscription;
  
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
    // get the rate plans from the repo
    this.loading = this.cs.basicGet(`/monetizationPackages/rate-plans`).subscribe(res => {
      res.data.forEach(el => {
        this.options.push({name: el.displayName, id: el.id});
      });
    });
  }
}