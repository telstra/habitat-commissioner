import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PopoverModule } from '../popover/popover.module';
import { LoginComponent } from './login.component';

@NgModule({
    declarations: [
      LoginComponent
    ],
    imports: [
        SharedModule,
        PopoverModule
    ],
    exports: [
      LoginComponent
    ]
})

export class LoginModule { }