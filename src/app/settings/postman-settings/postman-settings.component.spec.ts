import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostmanSettingsComponent } from './postman-settings.component';

describe('PostmanSettingsComponent', () => {
  let component: PostmanSettingsComponent;
  let fixture: ComponentFixture<PostmanSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostmanSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostmanSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
