import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SslSettingsComponent } from './ssl-settings.component';

describe('SslSettingsComponent', () => {
  let component: SslSettingsComponent;
  let fixture: ComponentFixture<SslSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SslSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SslSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
