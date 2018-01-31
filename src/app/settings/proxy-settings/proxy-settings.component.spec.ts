import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProxySettingsComponent } from './proxy-settings.component';

describe('ProxySettingsComponent', () => {
  let component: ProxySettingsComponent;
  let fixture: ComponentFixture<ProxySettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProxySettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProxySettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
