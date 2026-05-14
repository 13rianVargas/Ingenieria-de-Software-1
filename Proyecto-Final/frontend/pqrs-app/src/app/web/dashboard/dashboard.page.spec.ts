import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { DashboardPage } from './dashboard.page';
import { PQRSService } from '../../core/services/pqrs.service';
import { AuthService } from '../../core/services/auth.service';

describe('DashboardPage', () => {
  let component: DashboardPage;
  let fixture: ComponentFixture<DashboardPage>;

  const authServiceMock = {
    getCurrentUser: jasmine.createSpy('getCurrentUser').and.returnValue(null),
    logout: jasmine.createSpy('logout')
  };

  const pqrsServiceMock = {
    obtenerBandeja: jasmine.createSpy('obtenerBandeja'),
    generarReporte: jasmine.createSpy('generarReporte')
  };

  const routerMock = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [DashboardPage],
      providers: [
        { provide: PQRSService, useValue: pqrsServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).createComponent(DashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
