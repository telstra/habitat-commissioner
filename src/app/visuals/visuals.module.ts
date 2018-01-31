import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { GraphComponent } from './graph/graph.component';
import { SHARED_VISUALS } from './shared/index';
import { D3_DIRECTIVES, D3Service } from '../d3/index';

@NgModule({
    declarations: [
      GraphComponent,
      ...SHARED_VISUALS,
      ...D3_DIRECTIVES
    ],
    imports: [
        SharedModule
    ],
    providers: [
      D3Service
    ],
    exports: [
      GraphComponent,
      ...SHARED_VISUALS,
      ...D3_DIRECTIVES
    ]
})

export class VisualsModule { }