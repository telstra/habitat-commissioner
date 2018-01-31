import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DIRECTIVES } from '../directives/index';
import { PIPES } from '../pipes/index';

@NgModule({
  declarations: [
    ...DIRECTIVES,
    ...PIPES
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule
  ],
  exports: [
    ...DIRECTIVES,
    ...PIPES,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule
  ]
})

export class SharedModule { }