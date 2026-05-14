import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { DashboardPage } from './dashboard.page';
import { PQRSService } from '../../core/services/pqrs.service';
import { AuthService } from '../../core/services/auth.service';

describe('DashboardPage', () => {
  let component: DashboardPage;
  let fixture: ComponentFixture<DashboardPage>;

  const authServiceMock = {
    getCurrentUser: jasmine.createSpy('getCurrentUser').and.returnValue({ id: '1', identificacion: 'admin', nombre: 'Gestor', email: 'gestor@supermarket.com', rol: 'GESTOR' }),
    logout: jasmine.createSpy('logout'),
    hasValidToken: jasmine.createSpy('hasValidToken').and.returnValue(true)
  };

  const pqrsServiceMock = {
    obtenerBandeja: jasmine.createSpy('obtenerBandeja').and.returnValue(
      of({ success: true, data: { data: [], total: 0 } })
    ),
    generarReporte: jasmine.createSpy('generarReporte').and.returnValue(of(new Blob()))
  };

  const routerMock = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async () => {
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
