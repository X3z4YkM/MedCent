import { TestBed } from '@angular/core/testing';

import { MenagerService } from './menager.service';

describe('MenagerService', () => {
  let service: MenagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
