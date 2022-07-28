import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { ViewModelService } from './view-model.service';

describe('ViewModelService', () => {
  let service: ViewModelService;
  let fakeRouter = {
    events: of([])
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: fakeRouter },
      ]
    });
    service = TestBed.inject(ViewModelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
