import { TestBed } from '@angular/core/testing';

import { PointsManagerService } from './points-manager.service';

describe('PointsManagerService', () => {
  let service: PointsManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PointsManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
