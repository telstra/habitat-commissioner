import { Component, OnInit } from '@angular/core';
import { NotificationService } from "../services/notification.service";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs";
import { Animations } from '../animations/animations';
import { ApigeeResponseInterface } from '../models/apigee-response.interface';

/**
 * Display a toast notification to the user. Each notificaton stays on the screen for about 3 seconds and will stack on top of
 * each other to a maximum of 5
 */

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  animations: [Animations.flyInOut]
})
export class ToastComponent implements OnInit {

  // array of all toasts
  toasts: ApigeeResponseInterface[] = [];
  // max amount of toasts to be displayed
  maxCount = 5;
  // time in seconds the toast will stay on the screen
  timer = 3;
  // countdown timer
  countdown: Subscription;

  constructor(private ns: NotificationService) { }

  timeout() {
    this.countdown = Observable
      .timer(0, 1000)
      .map(i => this.timer - i)
      .take(this.timer + 1)
      .subscribe(i => {
        if (i <= 0) {
          this.toasts.splice(0, 1);
        }
      });
  }

  ngOnInit() {
    this.ns.showToast.subscribe(toast => {
      this.toasts.push(toast);
      this.timeout();
    });
  }

}
