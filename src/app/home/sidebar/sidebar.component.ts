import { Component, OnInit, Input, OnDestroy, EventEmitter, Output } from '@angular/core';
import { StateInterface } from '../../models/state.interface';
import { Animations } from '../../animations/animations';
import { Subscription } from 'rxjs';
import { StateService } from '../../services/state.service';
import { CommissionerService } from '../../services/commissioner.service';
import { AuthService } from '../../services/auth.service';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [Animations.flyInOut, Animations.listItemAnimation]
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() menuActive: boolean; // adjust padding on the menu depending on if its active or not
  @Output() viewLog: EventEmitter<void> = new EventEmitter<void>(); // emit to toggle logs
  @Output() loadingItem: EventEmitter<boolean> = new EventEmitter<boolean>(); // emit so the home component knows an item is loading

  // what items are collapsed and which ones are active. We build this dynamically as the user clicks on different items.
  // Collapses and expands lists in the sidebar
  isCollapsed = {};
  // apigee items in the list
  items = {};
  // currently selected item. Will colour the item name in the UI
  selected: string;
  // currently selected nested item. Will colour the item name in the UI
  nestedSelected: string;

  // loaders populate dynamically as the user clicks on items. Each parameter is a rxjs subscription that we use to display
  // a loading icon when active
  loaders = {};

  // previous state value, for comparing current and previous state
  previousState: string;
  // list of base items in the sidebar
  list: string[];

  // subscribe to changes in the states value
  stateSubscriber: Subscription;

  // Each base element in the sidebar has its own search box. This object will populate dynamically and with the elment name as a key and 
  // user input as the value
  searchStrings = {};

  constructor(
    private stateService: StateService,
    private cs: CommissionerService,
    private auth: AuthService,
    private utils: UtilsService
  ) { }

  // toggle display of the logs in the home component
  toggleLog() {
    this.viewLog.emit();
  }

  // logout of the front end app
  signout() {
    this.stateService.view(null);
    this.auth.logout();
  }

  // navigate to the specified route. We can only navigate away from home screen from here so reset the value of the state
  navigate(route) {
    this.stateService.view(null);
    this.cs.navigate(route);
  }

  // HC API doesnt always return an array, sometimes it is an object with key: value[] so we fix that here
  makeArray(data) {
    if (Array.isArray(data)) {
      // if we get an array back we're good to go
      return data;
    } else {
      // if not we need to transform
      return data[Object.keys(data)[0]];
    }
  }

  /**
   * set the selected item for upadating the UI only, then call set setItem to get the item details and set it in the state. 
   * If the item clicked is already selected then unset the current item
   * @param el base type, eg apiProducts
   * @param item the item
   */
  setSelected(el, item) {
    let itemId = this.getId(item);
    if(this.selected === itemId) {
      this.selected = null;
      this.stateService.resetItem();
    } else {
      this.selected = itemId;
      this.setItem(el, itemId);
    }
  }

  /**
   * Get details for the item, or the list of nested items, and then set them in the state 
   * @param el base item type
   * @param itemId item id
   * @param parent if supplied set the parent item in the state
   */
  setItem(el, itemId, parent?) {
    this.loadingItem.emit(true);

    // set the parent in the state service is supplied
    if (!parent) { 
      this.nestedSelected = null; 
      if(this.state().item) {
        this.stateService.parent(null);
      }
    } else {
      this.stateService.parent(parent);
    }

    // get details for the item from the HC API
    this.loaders[el][itemId] = this.cs.basicGet(`${el}/${this.state().view}/details/${this.state().item ? this.state().item.parent ? this.getId(this.state().item.parent) + '/' + itemId : itemId : itemId}`)
      .subscribe(res => {
        // update the current item in the state service
        this.stateService.item(el, res.data);
        this.loadingItem.emit(false);

        // if the item base is any of these and a parent item is not supplied then we have clicked on a parent item.
        // We use the HC API to get its children eg. Get developer apps (child) for developer (parent), or rate plans (child) for a package (parent)
        if (!this.items[el][itemId] && !parent && (el === 'developers' || el === 'companies' || el === 'kvms' || el === 'monetizationPackages' || el === 'proxies' && this.state().view === 'apigee' || el === 'sharedFlows' && this.state().view === 'apigee')) {
          this.loaders[el][itemId] = this.cs.basicGet(`${el}/${this.state().view}/list/${itemId}`)
            .subscribe(res => {
              this.items[el][itemId] = this.makeArray(res.data);
            });
        }
      }, error => console.error(error));
  }

  // get the items for a specified base. Eg. get all api products
  getItems(el) {
    if (!this.items[el] && this.isCollapsed[el]) {
      this.loaders[el] = this.cs.basicGet(`${el}/${this.stateService.state$.getValue().view}/list`).subscribe(res => {
        //this.items[el] = this.makeArray(res.data);
        this.items[el] = this.utils.sortArray(this.makeArray(res.data));
      });
    }
  }

  // reset the view
  reset() {
    this.list = null;
    this.isCollapsed = {};
    this.items = {};
    this.loaders = {};
    this.selected = null;

    if (this.state().env && this.state().org && this.state().repo) {
      this.loaders['resources'] = this.cs.basicGet(`/api`).subscribe(res => {
        this.list = res.data.sort();
      }, error => console.error(error));
    }
  }

  // get the current value of the state
  state() {
    return this.stateService.getState();
  }

  // get display name for an item in sidebar
  getDisplayName(item) {
    return item.displayName || item.name || item.id || item;
  }

  // get the id for an item in the sidebar
  getId(item) {
    return item.id || item.name || item;
  }

  ngOnInit() {
    // subscribe to changes in the state object
    this.stateSubscriber = this.stateService.state$.subscribe(state => {
      // check if we need to reset the sidebar
      if (!this.previousState) {
        this.previousState = JSON.stringify(state); this.reset();
      } else {
        let previousState: StateInterface = JSON.parse(this.previousState);

        if (previousState.view !== state.view
          || previousState.env !== state.env
          || previousState.org !== state.org
          || previousState.repo !== state.repo) {
          this.reset();
        }

        this.previousState = JSON.stringify(state);
      }
    });
  }

  ngOnDestroy() {
    this.stateSubscriber.unsubscribe();
  }

}
