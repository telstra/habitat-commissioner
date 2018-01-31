import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemButtonOptionsComponent } from './item-button-options.component';

describe('ItemButtonOptionsComponent', () => {
  let component: ItemButtonOptionsComponent;
  let fixture: ComponentFixture<ItemButtonOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemButtonOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemButtonOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
