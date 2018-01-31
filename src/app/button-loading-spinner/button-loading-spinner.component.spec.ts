import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonLoadingSpinnerComponent } from './button-loading-spinner.component';

describe('ButtonLoadingSpinnerComponent', () => {
  let component: ButtonLoadingSpinnerComponent;
  let fixture: ComponentFixture<ButtonLoadingSpinnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonLoadingSpinnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonLoadingSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
