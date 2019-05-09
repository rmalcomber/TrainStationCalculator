import { TestBed } from '@angular/core/testing';

import { JsonDataProviderService } from './data-provider.service';

describe('DataProviderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JsonDataProviderService = TestBed.get(JsonDataProviderService);
    expect(service).toBeTruthy();
  });
});
