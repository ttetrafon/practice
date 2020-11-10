import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YadtsMagicComponent } from './yadts-magic.component';

describe('YadtsMagicComponent', () => {
  let component: YadtsMagicComponent;
  let fixture: ComponentFixture<YadtsMagicComponent>;

  beforeEach(async(() => {
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
