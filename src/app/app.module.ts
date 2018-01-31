import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { routing } from './app.routing';

// components
import { AppComponent } from './app.component';
import { ToastComponent } from './toast/toast.component';
import { ErrorComponent } from './error/error.component';

// modals
import { MODAL_COMPONENTS } from './modals';

// modules
import { SharedModule } from './shared/shared.module';
import { LogModule } from './log/log.module';
import { LoginModule } from './login/login.module';
import { HomeModule } from './home/home.module';
import { SettingsModule } from './settings/settings.module';
import { SwaggerModule } from './swagger/swagger.module';
import { PostmanTestingModule } from './postman-testing/postman-testing.module';

// providers
import { AuthService } from './services/auth.service';
import { CommissionerService } from './services/commissioner.service';
import { NotificationService } from './services/notification.service';
import { UtilsService } from './services/utils.service';
import { StateService } from './services/state.service';
import { FuseService } from './services/fuse.service';

// guards
import { AuthGuard } from './guards/auth/auth.guard';
import { LoginGuard } from './guards/login/login.guard';

@NgModule({
  declarations: [
    AppComponent,
    ToastComponent,
    ErrorComponent,
    ...MODAL_COMPONENTS
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    NgbModule.forRoot(),
    SharedModule,
    LogModule,
    LoginModule,
    HomeModule,
    SettingsModule,
    SwaggerModule,
    PostmanTestingModule,
    routing
  ],
  providers: [
    AuthGuard,
    LoginGuard,
    AuthService,
    CommissionerService,
    UtilsService,
    NotificationService,
    StateService,
    FuseService
  ],
  entryComponents: [
    ...MODAL_COMPONENTS
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
