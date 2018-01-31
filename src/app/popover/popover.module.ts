import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PopoverComponent } from './popover.component';

@NgModule({
  declarations: [
    PopoverComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    PopoverComponent
  ]
})

export class PopoverModule { }