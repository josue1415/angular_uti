import { TestBed } from '@angular/core/testing';

import { NuevoForoService } from './nuevo-foro.service';

describe('NuevoForoService', () => {
  let service: NuevoForoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NuevoForoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
