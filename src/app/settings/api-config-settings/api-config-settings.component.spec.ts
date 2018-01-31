import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiConfigSettingsComponent } from './api-config-settings.component';

describe('ApiConfigSettingsComponent', () => {
  let component: ApiConfigSettingsComponent;
  let fixture: ComponentFixture<ApiConfigSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApiConfigSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiConfigSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
