import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { YadtsMagicComponent } from './yadts-magic.component';

describe('YadtsMagicComponent', () => {
  let component: YadtsMagicComponent;
  let fixture: ComponentFixture<YadtsMagicComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ YadtsMagicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YadtsMagicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
