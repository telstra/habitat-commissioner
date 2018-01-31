import { Component, OnInit, Input } from '@angular/core';
import { NgbPopoverConfig } from "@ng-bootstrap/ng-bootstrap";

/**
 * A small tooltip like component that shows the user come context sensitive message passed in via @Input.
 * Can also include a title for the popover and placement: top, left, bottom or right.
 * 
 * For more info see https://ng-bootstrap.github.io/#/components/popover/examples
 */

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss']
})
export class PopoverComponent implements OnInit {

  @Input() content: string;
  @Input() title: string;
  @Input() placement: string;

  constructor(config: NgbPopoverConfig) {
  }

  ngOnInit() {
    // if no placement value provided then we default placement to right
    if(!this.placement) { this.placement = 'right'; }
  }

}
