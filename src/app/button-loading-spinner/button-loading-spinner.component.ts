import { Component, OnInit, Input } from '@angular/core';

/**
 * Small SVG animation placed inside some buttons. Code adapted from http://tobiasahlin.com/spinkit/
 */

@Component({
  selector: 'app-button-loading-spinner',
  templateUrl: './button-loading-spinner.component.html',
  styleUrls: ['./button-loading-spinner.component.scss']
})
export class ButtonLoadingSpinnerComponent implements OnInit {
  @Input() color: string;
  
  constructor(
  ) { }

  ngOnInit() {
  }

}
