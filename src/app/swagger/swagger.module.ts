import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { SwaggerComponent } from './swagger.component';

@NgModule({
    declarations: [
      SwaggerComponent
    ],
    imports: [
        SharedModule
    ],
    exports: [
      SwaggerComponent
    ]
})

export class SwaggerModule { }