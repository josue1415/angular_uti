import { TestBed } from '@angular/core/testing';

import { VerNoticiaService } from './ver-noticia.service';

describe('VerNoticiaService', () => {
  let service: VerNoticiaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VerNoticiaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
