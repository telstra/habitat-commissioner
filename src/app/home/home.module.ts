import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PopoverModule } from '../popover/popover.module';
import { HomeComponent } from './home.component';
import { HeaderComponent } from './header/header.component';
import { ItemButtonOptionsComponent } from './item-button-options/item-button-options.component';
import { ItemDetailsComponent } from './item-details/item-details.component';
import { ItemQueuesComponent } from './item-queues/item-queues.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LogModule } from '../log/log.module';
import { ButtonLoadingSpinnerModule } from '../button-loading-spinner/button-loading-spinner.module';
import { VisualizationModule } from './visualization/visualization.module';

@NgModule({
  declarations: [
    HomeComponent,
    HeaderComponent,
    ItemButtonOptionsComponent,
    ItemDetailsComponent,
    ItemQueuesComponent,
    SidebarComponent
  ],
  imports: [
    SharedModule,
    PopoverModule,
    LogModule,
    ButtonLoadingSpinnerModule,
    VisualizationModule
  ],
  exports: [
    HomeComponent,
    HeaderComponent,
    ItemButtonOptionsComponent,
    ItemDetailsComponent,
    ItemQueuesComponent,
    SidebarComponent
  ]
})

export class HomeModule { }