import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootAlphaComponent } from './root-alpha.component';

describe('RootAlphaComponent', () => {
  let component: RootAlphaComponent;
  let fixture: ComponentFixture<RootAlphaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RootAlphaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RootAlphaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
