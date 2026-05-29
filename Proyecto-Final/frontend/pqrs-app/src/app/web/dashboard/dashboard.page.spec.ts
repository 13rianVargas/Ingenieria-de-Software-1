import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
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
    navigate: jasmine.createSpy('navigate'),
    events: of(),
    url: '/web/dashboard'
  };

  const navControllerMock = {
    navigateForward: jasmine.createSpy('navigateForward'),
    navigateBack: jasmine.createSpy('navigateBack'),
    navigateRoot: jasmine.createSpy('navigateRoot')
  };

  beforeEach(async () => {
    fixture = TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [DashboardPage],
      imports: [IonicModule, FormsModule],
      providers: [
        { provide: PQRSService, useValue: pqrsServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: NavController, useValue: navControllerMock }
      ]
    }).createComponent(DashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
