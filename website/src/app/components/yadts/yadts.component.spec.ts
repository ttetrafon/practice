import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { YadtsComponent } from './yadts.component';

describe('YadtsComponent', () => {
  let component: YadtsComponent;
  let fixture: ComponentFixture<YadtsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ YadtsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YadtsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
