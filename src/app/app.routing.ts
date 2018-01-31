import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';
import { AuthGuard } from './guards/auth/auth.guard';
import { LoginGuard } from './guards/login/login.guard';
import { SwaggerComponent } from './swagger/swagger.component';
import { PostmanTestingComponent } from './postman-testing/postman-testing.component';

const APP_ROUTES: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
    { path: 'swagger', component: SwaggerComponent, canActivate: [AuthGuard] },
    { path: 'postman-testing', component: PostmanTestingComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: 'login' }
]

export const routing = RouterModule.forRoot(APP_ROUTES);