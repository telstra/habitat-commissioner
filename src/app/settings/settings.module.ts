import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PopoverModule } from '../popover/popover.module';
import { SettingsComponent } from './settings.component';
import { ApiConfigSettingsComponent } from './api-config-settings/api-config-settings.component';
import { PostmanSettingsComponent } from './postman-settings/postman-settings.component';
import { ProxySettingsComponent } from './proxy-settings/proxy-settings.component';
import { SslSettingsComponent } from './ssl-settings/ssl-settings.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { ButtonLoadingSpinnerModule } from '../button-loading-spinner/button-loading-spinner.module';

@NgModule({
    declarations: [
      SettingsComponent,
      ApiConfigSettingsComponent,
      PostmanSettingsComponent,
      ProxySettingsComponent,
      SslSettingsComponent,
      UserSettingsComponent
    ],
    imports: [
        SharedModule,
        ButtonLoadingSpinnerModule,
        PopoverModule
    ],
    exports: [
      SettingsComponent,
      ApiConfigSettingsComponent,
      PostmanSettingsComponent,
      ProxySettingsComponent,
      SslSettingsComponent,
      UserSettingsComponent
    ]
})
export class SettingsModule {}