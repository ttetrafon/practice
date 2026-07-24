import { TestBed } from '@angular/core/testing';

import { CustomButtonService } from './custom-button.service';

describe('CustomButtonService', () => {
  let service: CustomButtonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomButtonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
