import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { VisualizationComponent } from './visualization.component';
import { VisualsModule } from '../../visuals/visuals.module';

@NgModule({
  declarations: [
    VisualizationComponent
  ],
  imports: [
    VisualsModule,
    SharedModule
  ],
  exports: [
    VisualizationComponent
  ]
})

export class VisualizationModule { }