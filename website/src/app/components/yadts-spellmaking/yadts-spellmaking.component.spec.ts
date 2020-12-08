import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { YadtsSpellmakingComponent } from './yadts-spellmaking.component';

describe('YadtsSpellmakingComponent', () => {
  let component: YadtsSpellmakingComponent;
  let fixture: ComponentFixture<YadtsSpellmakingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ YadtsSpellmakingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YadtsSpellmakingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
