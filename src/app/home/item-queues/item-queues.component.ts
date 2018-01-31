import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Animations } from '../../animations/animations';
import { CommissionerService } from '../../services/commissioner.service';
import { StateService } from '../../services/state.service';
import { UtilsService } from '../../services/utils.service';

/**
 * There are 3 different types of queues:
 * - Procure queue: Read items from Apigee and write them to the repo
 * - Create queue: Read items from the repo and create them in Apigee
 * - Update queue: Update an existing item in Apigee with data from the repo
 * 
 * Each queue contains an item base, eg. apiProducts, and the items themselves as children of that base.
 * So we can build mulitiple queues for multiple item types and then execute them all at once by clicking the execute queue button.
 */

@Component({
  selector: 'app-item-queues',
  templateUrl: './item-queues.component.html',
  styleUrls: ['./item-queues.component.scss'],
  animations: [Animations.listItemAnimation]
})
export class ItemQueuesComponent implements OnInit {

  @Input() queue: any[];  // items in queue
  @Input() type: string;  // queue type (procure, create, update)

  // collapse the item base types and entire queue card
  isCollapsed = {
    toggle: true
  };
  // loading object tracks what operations are being performed. Each paramater is an rxjs subscription we use to show a loading spinner
  loading = {};

  // Each base element in the queue has its own search box. This object will populate dynamically and with the elment name as a key and 
  // user input as the value
  searchStrings = {};

  constructor(
    private cs: CommissionerService,
    private stateService: StateService,
    private utils: UtilsService
  ) { }

  /**
   * Execute a queue of items
   * @param type the queue type
   * @param el the item base
   */
  execute(type, el) {
    try {
      this[type](el);
    }
    catch(e) {
      console.error(e);
    }
  }

  /**
   * Execute create queue of items
   * @param el the item base
   */
  create(el) {
    this.loading[el.base] = this.cs.apigeePost(`${el.base}/apigee`, el.items).subscribe(res => {
      //console.log(res);
      this.clearQueue(el.base);
    }, error => console.error(error));
  }

  /**
   * Execute update queue of items
   * @param el the item base
   */
  update(el) {
    this.loading[el.base] = this.cs.apigeePut(`${el.base}/apigee`, el.items).subscribe(res => {
      //console.log(res);
      this.clearQueue(el.base);
    }, error => console.error(error));
  }

  /**
   * Execute procure queue of items
   * @param el the item base
   */
  procure(el) {
    this.loading[el.base] = this.cs.apigeePost(`${el.base}/repo`, el.items).subscribe(res => {
      this.clearQueue(el.base);
    }, error => console.error(error));
  }

  /**
   * Remove an item from a queue
   * @param base the item base type
   * @param item the item
   */
  removeFromQueue(base, item) {
    this.stateService.removeFromQueue(this.type, base, item);
  }

  /**
   * Clear the queue of an entire base type
   * @param base item base
   */
  clearQueue(base) {
    this.stateService.clearQueue(this.type, base);
  }

  sorted(items) {
    return this.utils.sortArray(items);
  }

  ngOnInit() {
  }

}
