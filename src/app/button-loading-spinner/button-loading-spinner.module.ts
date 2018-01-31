import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ButtonLoadingSpinnerComponent } from './button-loading-spinner.component';

@NgModule({
    declarations: [
      ButtonLoadingSpinnerComponent
    ],
    imports: [
      SharedModule
    ],
    exports: [
      ButtonLoadingSpinnerComponent
    ]
})

export class ButtonLoadingSpinnerModule { }