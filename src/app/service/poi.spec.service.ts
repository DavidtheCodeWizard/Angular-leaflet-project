import { TestBed } from '@angular/core/testing';

import { Poi } from './poi';

describe('Poi', () => {
  let service: Poi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Poi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
