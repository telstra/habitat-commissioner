import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs/Subscription';
import { CommissionerService } from '../../services/commissioner.service';
import { Observable } from 'rxjs/Observable';
import { ApigeeResponseInterface } from '../../models/apigee-response.interface';

/**
 * Display all of the company/ developer apps that use the selected API product
 * 
 * For more information on ng-bootstrap modals see https://ng-bootstrap.github.io/#/components/modal/examples
 */

@Component({
  selector: 'api-product-apps-modal',
  templateUrl: './api-product-apps.component.html'
})
export class ApiProductAppsComponent implements OnInit, OnDestroy {
  item: any;
  displayName: string;
  metaData: any;
  appType: string; // companies or developers

  list = [];
  loading: Subscription;

  constructor(
    public activeModal: NgbActiveModal,
    private cs: CommissionerService
  ) { }

  close() {
    this.activeModal.close();
  }

  ngOnInit() {
    this.appType = this.metaData.appType;
    this.loading = this.cs.basicGet(`/${this.appType}/apigee/list`)
      .flatMap(res => { return Observable.concat(...res.data.map(name => this.cs.basicGet(`/${this.appType}/apigee/details/${name}`))) })
      .filter(res => res['data'].apps && res['data'].apps.length > 0)
      .flatMap(res => {
        let details = res['data'];
        return Observable.concat(...details.apps.map(app => this.cs.basicGet(`/${this.appType}/apigee/details/${details.email ? details.email : details.name}/${app}`)))
      })
      .subscribe(res => {
        if(res['data'].credentials.map(({ apiProducts}) => {
          return apiProducts.find(x => x.apiproduct === this.item.name);
        })[0]) {
          this.list.push(res['data']);
        }
      });
  }

  ngOnDestroy() {
    this.loading.unsubscribe();
  }
}