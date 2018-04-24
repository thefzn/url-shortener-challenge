import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortDetailsComponent } from './short-details.component';

describe('ShortDetailsComponent', () => {
  let component: ShortDetailsComponent;
  let fixture: ComponentFixture<ShortDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShortDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShortDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
