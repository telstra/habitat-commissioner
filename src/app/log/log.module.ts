import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { LogComponent } from './log.component';

@NgModule({
    declarations: [
        LogComponent
    ],
    imports: [
        SharedModule
    ],
    exports: [
        LogComponent
    ]
})

export class LogModule { }