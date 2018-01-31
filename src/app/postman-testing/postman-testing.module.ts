import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PostmanTestingComponent } from './postman-testing.component';
import { LogModule } from '../log/log.module';

@NgModule({
    declarations: [
      PostmanTestingComponent
    ],
    imports: [
      SharedModule,
      LogModule
    ],
    exports: [
      PostmanTestingComponent
    ]
})

export class PostmanTestingModule { }