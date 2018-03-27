import { Injectable } from "@angular/core";
import { FormGroup, FormArray, FormControl } from "@angular/forms";
import { AddProductToPackageModalComponent } from '../modals/add-product-to-package/add-product-to-package.component';
import { RemoveProductFromPackageModalComponent } from '../modals/remove-product-from-package/remove-product-from-package.component';
import { AddRatePlanModalComponent } from '../modals/add-rateplan/add-rateplan.component';
import { ApiProductAppsComponent } from "../modals/api-product-apps/api-product-apps.component";
import { IOption } from "../models/item-options.interface";
import { StateService } from "./state.service";

/**
 * Utility functions
 */

@Injectable()

export class UtilsService {
  constructor(private state: StateService) { }

  // Recurse through a form group and mark all controls as touched
  setAsTouched(group: FormGroup | FormArray) {
    group.markAsTouched();
    for (let i in group.controls) {
      if (group.controls[i] instanceof FormControl) {
        group.controls[i].markAsTouched();
      } else {
        this.setAsTouched(group.controls[i]);
      }
    }
  }

  // sort an array of objects by the identifier key. This could be name, id, displayName or the array might just be strings
  sortArray(array: any[]) {
    return array.sort((a, b) => {
      try {
        let _a = this.state.getDisplayName(a),
          _b = this.state.getDisplayName(b);
        return _a.localeCompare(_b);
      } catch (e) { return 0 }
    });
  }

  // Many items in the HC front end app have additional options outside of get, post and update. Here we define these additional
  // options. Wherever you see the 'more options' button the app, the data that populates it comes from here

  apigeeApiProductOptions(item): IOption[] {
    return [
      { name: `Company apps`, modal: ApiProductAppsComponent, metaData: { appType: 'companies' } },
      { name: `Developer apps`, modal: ApiProductAppsComponent, metaData: { appType: 'developers' } }
    ]
  }

  apigeeKvmEntryOptions(item): IOption[] {
    return [
      { name: `Delete this entry`, method: 'Delete', endpoint: `/${item.base}/${item.parent}/${item.data.name}`, danger: true, showDeleteConfirmation: true }
    ]
  }

  repoKvmEntryOptions(item): IOption[] {
    return [
      { name: `Add this entry`, method: 'Post', endpoint: `/${item.base}/apigee/${item.parent.name}`, payload: [item.data.name] },
      { name: 'Update this entry', method: 'Put', endpoint: `/${item.base}/apigee/${item.parent.name}`, payload: [item.data.name] }
    ]
  }

  repoAppOptions(item): IOption[] {
    return [
      { name: 'Add this app', method: 'Post', endpoint: `/${item.base}/apigee/${item.parent.name}`, payload: [item.data.name] },
      { name: 'Update this app', method: 'Put', endpoint: `/${item.base}/apigee/${item.parent.name}`, payload: [item.data.name] }
    ]
  }

  apigeeRevisionOptions(item): IOption[] {
    let name, revision;
    if (item.base === 'sharedFlows') {
      name = item.data.sharedFlow;
      revision = item.data.name;
    } else {
      name = item.data.name;
      revision = item.data.revision;
    }
    return [
      { name: `Deploy revision`, method: 'Post', endpoint: `/${item.base}/deploy/${name}/${revision}` },
      { name: `Undeploy revision`, method: 'Delete', endpoint: `/${item.base}/undeploy/${name}/${revision}`, danger: true },
      { name: `Delete revision`, method: 'Delete', endpoint: `/${item.base}/${name}/${revision}`, danger: true, showDeleteConfirmation: true }
    ]
  }

  apigeePackagesOptions(item): IOption[] {
    return [
      { name: 'Add rate plans', method: 'Post', endpoint: `/${item.base}/apigee/${item.data.id}`, modal: AddRatePlanModalComponent },
      { name: 'Add API products', method: 'Post', endpoint: `/${item.base}/product/${item.data.id}`, modal: AddProductToPackageModalComponent },
      { name: 'Remove an API product', method: 'Delete', endpoint: `/${item.base}/product/${item.data.id}`, modal: RemoveProductFromPackageModalComponent, danger: true, showDeleteConfirmation: true, hideDetailsInDeleteConfirmation: true }
    ]
  }

  apigeeRatePlanOptions(item): IOption[] {
    return [
      { name: 'End date this rate plan', method: 'Delete', endpoint: `/${item.base}/${item.parent.id}/${item.data.id}`, danger: true }
    ]
  }

  repoRatePlanOptions(item): IOption[] {
    return [
      { name: 'Create as future rate plan', method: 'Post', endpoint: `/${item.base}/apigee/${item.parent.id}/${item.data.id}` }
    ]
  }
}