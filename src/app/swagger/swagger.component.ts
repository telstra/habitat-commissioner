import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { SwaggerUIBundle, SwaggerUIStandalonePreset } from 'swagger-ui-dist';
import { Router } from '@angular/router';
import SWAGGER from './swagger';

export const swaggerUIBundle = SwaggerUIBundle;
export const swaggerUIStandalonePreset = SwaggerUIStandalonePreset;

/**
 * Show the swagger spec using swagger-ui. I think the css is conflicting somewhere else here, but I could never figure it out.
 * 
 * for more info on swagger ui: https://www.npmjs.com/package/swagger-ui
 * implementing in Angular: https://github.com/shockey/swagger-ui-angular4/issues/1
 */

@Component({
  selector: 'app-swagger',
  templateUrl: './swagger.component.html',
  styleUrls: ['./swagger.component.scss']
})
export class SwaggerComponent implements AfterViewInit {

  constructor(
    private router: Router,
    private el: ElementRef
  ) {
  }

  returnHome() {
    this.router.navigateByUrl('/home');
  }

  ngAfterViewInit() {
    const ui = swaggerUIBundle({
      spec: SWAGGER,
      domNode: this.el.nativeElement.querySelector('#swagger-container'),
      deepLinking: false,
      displayOperationId: true,
      presets: [
        swaggerUIBundle.presets.apis,
        swaggerUIStandalonePreset
      ],
      plugins: [
        swaggerUIBundle.plugins.DownloadUrl
      ],
      layout: 'StandaloneLayout'
    });
  }

}
