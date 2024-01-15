import { TestBed } from '@angular/core/testing';

import { MouseManagerService } from './mouse-manager.service';

describe('MouseManagerService', () => {
  let service: MouseManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MouseManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
