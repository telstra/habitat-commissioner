import { Component, OnInit, Input } from '@angular/core';

/**
 * Component for displaying item details. I had great ambitions for this component and a lot has been deleted, now theres nothing left.
 * Displays the current item as pretty JSON
 */
@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss']
})
export class ItemDetailsComponent implements OnInit {

  @Input() data: any;

  constructor() { }

  ngOnInit() {
  }

}
