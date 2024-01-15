import { TestBed } from '@angular/core/testing';

import { ShapesTranslatorService } from './shapes-translator.service';

describe('ShapesTranslatorService', () => {
  let service: ShapesTranslatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShapesTranslatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
