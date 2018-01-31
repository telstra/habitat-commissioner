import { Directive, Input, ElementRef, OnChanges } from '@angular/core';

/**
 * Appends a font awesome icon to some html element depending on the data received via @Input
 */

@Directive({
  selector: '[appMenuItemIcon]'
})

export class MenuItemIconDirective implements OnChanges {
  @Input('appMenuItemIcon') data;

  constructor(private el: ElementRef) {
  }

  ngOnChanges() {
    let html: HTMLElement = this.el.nativeElement;
    if (this.data) {
      switch (this.data.split('.')[0]) {
        case 'caches':
          html.className = 'fa fa-database';
          break;
        case 'kvms':
          html.className = 'fa fa-object-group';
          break;
        case 'targetServers':
          html.className = 'fa fa-dot-circle-o';
          break;
        case 'apiProducts':
          html.className = 'fa fa-cube';
          break;
        case 'monetizationCurrencies':
          html.className = 'fa fa-dollar';
          break;
        case 'monetizationPackages':
          html.className = 'fa fa-cubes';
          break;
        case 'monetizationPackageRateplans':
          html.className = 'fa fa-money';
          break;
        case 'notification-email-templates':
          html.className = 'fa fa-envelope-o';
          break;
        case 'reports':
          html.className = 'fa fa-clipboard';
          break;
        case 'proxies':
          html.className = 'fa fa-link';
          break;
        case 'sharedFlows':
          html.className = 'fa fa-refresh';
          break;
        case 'companies':
          html.className = 'fa fa-building';
          break;
        case 'companyApps':
          html.className = 'fa fa-wrench';
          break;
        case 'developers':
          html.className = 'fa fa-user';
          break;
        case 'developerApps':
          html.className = 'fa fa-code';
          break;
        case 'notification-conditions':
          html.className = 'fa fa-commenting'
          break;
        default:
          html.className = 'fa fa-code'
          break;
      }
    } else {
      html.className = 'fa fa-exclamation-circle'
    }
  }

}
