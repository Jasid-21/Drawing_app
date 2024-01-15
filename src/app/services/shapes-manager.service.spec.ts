import { TestBed } from '@angular/core/testing';

import { ShapesManagerService } from './shapes-manager.service';

describe('ShapesManagerService', () => {
  let service: ShapesManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShapesManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
