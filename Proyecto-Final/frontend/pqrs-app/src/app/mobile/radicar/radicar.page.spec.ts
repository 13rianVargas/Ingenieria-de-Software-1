import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { of } from 'rxjs';
import { RadicarPage } from './radicar.page';
import { AuthService } from '../../core/services/auth.service';
import { PQRSService } from '../../core/services/pqrs.service';

describe('RadicarPage', () => {
  let component: RadicarPage;
  let fixture: ComponentFixture<RadicarPage>;

  const authServiceMock = {
    getCurrentUser: jasmine.createSpy('getCurrentUser').and.returnValue(null),
    hasValidToken: jasmine.createSpy('hasValidToken').and.returnValue(false)
  };

  const pqrsServiceMock = {
    crearPQRS: jasmine.createSpy('crearPQRS').and.returnValue(
      of({ radicado: '12345', fechaRadicado: new Date(), estado: 'NUEVO' })
    )
  };

  const routerMock = {
    navigate: jasmine.createSpy('navigate'),
    events: of(),
    url: '/mobile/radicar'
  };

  const toastControllerMock = {
    create: jasmine.createSpy('create').and.returnValue(Promise.resolve({ present: jasmine.createSpy('present') }))
  };

  const navControllerMock = {
    navigateForward: jasmine.createSpy('navigateForward'),
    navigateBack: jasmine.createSpy('navigateBack'),
    navigateRoot: jasmine.createSpy('navigateRoot')
  };

  beforeEach(async () => {
    fixture = TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [RadicarPage],
      imports: [ReactiveFormsModule, IonicModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: PQRSService, useValue: pqrsServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ToastController, useValue: toastControllerMock },
        { provide: NavController, useValue: navControllerMock }
      ]
    }).createComponent(RadicarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
