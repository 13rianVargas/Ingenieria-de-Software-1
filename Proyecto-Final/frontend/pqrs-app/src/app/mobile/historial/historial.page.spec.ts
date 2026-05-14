import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HistorialPage } from './historial.page';
import { PQRSService } from '../../core/services/pqrs.service';
import { AuthService } from '../../core/services/auth.service';

describe('HistorialPage', () => {
  let component: HistorialPage;
  let fixture: ComponentFixture<HistorialPage>;

  const authServiceMock = {
    getCurrentUser: jasmine.createSpy('getCurrentUser').and.returnValue(null),
    hasValidToken: jasmine.createSpy('hasValidToken').and.returnValue(false)
  };

  const pqrsServiceMock = {
    obtenerHistorial: jasmine.createSpy('obtenerHistorial')
  };

  const routerMock = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async () => {
    fixture = TestBed.configureTestingModule({
      declarations: [HistorialPage],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: PQRSService, useValue: pqrsServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).createComponent(HistorialPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
