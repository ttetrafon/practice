import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootBetaComponent } from './root-beta.component';

describe('RootBetaComponent', () => {
  let component: RootBetaComponent;
  let fixture: ComponentFixture<RootBetaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RootBetaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RootBetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
