import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { CommissionerService } from "../services/commissioner.service";
import { LogInterface } from "../models/log.interface";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { LogModalComponent } from '../modals/log-modal/log-modal.component';

/**
 * Display the logs as they happen in a table
 */

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})
export class LogComponent implements OnInit {

  //@Output() scroll: EventEmitter<void> = new EventEmitter<void>();

  // selected log level
  logLevel: string;
  
  // all logs
  logs: LogInterface[] = [];

  // logs currently being displayed, filtered by logLevel
  displayLogs: LogInterface[] = [];

  constructor(private cs: CommissionerService, private modalService: NgbModal) { }

  // emitScroll() {
  //   this.scroll.emit();
  // }

  scrollTop(anchor) {
    anchor.scrollIntoView();
  }

  openDataModal(log) {
    const modalRef = this.modalService.open(LogModalComponent, { size: 'lg' });
    modalRef.componentInstance.log = log;
  }

  getTime(date?: Date) {
    return date != null ? date.getTime() : 0;
  }

  // toggleDisplay() {
  //   if (this.logLevel === 'all') {
  //     this.displayLogs = this.logs;
  //   } else {
  //     this.logs.forEach(log => {
  //       if (log.level === this.logLevel) {
  //         this.displayLogs.unshift(log);
  //       }
  //     });
  //   }

  //   this.displayLogs.sort((a, b) => {
  //     return this.getTime(new Date(b.timestamp)) - this.getTime(new Date(a.timestamp));
  //   });
  // }

  toggleLogLevel(logLevel) {
    this.logLevel = logLevel;

    this.displayLogs = [];
    // this.toggleDisplay();
    
    if (this.logLevel === 'all') {
      this.displayLogs = this.logs;
    } else {
      this.logs.forEach(log => {
        if (log.level === this.logLevel) {
          this.displayLogs.unshift(log);
        }
      });
    }

    this.displayLogs.sort((a, b) => {
      return this.getTime(new Date(b.timestamp)) - this.getTime(new Date(a.timestamp));
    });
  }

  ngOnInit() {
    this.toggleLogLevel('all');
    // subscribe to the socket io connection in the commissioner service
    this.cs.getLog().subscribe((log: LogInterface) => {
      this.logs.unshift(log);
    });
  }

}
