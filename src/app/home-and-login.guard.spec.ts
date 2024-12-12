import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { homeAndLoginGuard } from './home-and-login.guard';

describe('homeAndLoginGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => homeAndLoginGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
