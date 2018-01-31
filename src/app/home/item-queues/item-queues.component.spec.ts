import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemQueuesComponent } from './item-queues.component';

describe('ItemQueuesComponent', () => {
  let component: ItemQueuesComponent;
  let fixture: ComponentFixture<ItemQueuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemQueuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemQueuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
