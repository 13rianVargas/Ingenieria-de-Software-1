import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
﻿import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { of } from 'rxjs';
import { HistorialPage } from './historial.page';
import { PQRSService } from '../../core/services/pqrs.service';
import { AuthService } from '../../core/services/auth.service';

describe('HistorialPage', () => {
  let component: HistorialPage;
  let fixture: ComponentFixture<HistorialPage>;

  const authServiceMock = {
    getCurrentUser: jasmine.createSpy('getCurrentUser').and.returnValue({ id: '1', identificacion: '12345678', nombre: 'Cliente Test', email: 'cliente@test.com', rol: 'CLIENTE' }),
    hasValidToken: jasmine.createSpy('hasValidToken').and.returnValue(true),
    logout: jasmine.createSpy('logout')
  };

  const pqrsServiceMock = {
    misRadicados: jasmine.createSpy('misRadicados').and.returnValue(of([]))
  };

  const routerMock = {
    navigate: jasmine.createSpy('navigate'),
    events: of(),
    url: '/mobile/historial'
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
      declarations: [HistorialPage],
      imports: [IonicModule, FormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: PQRSService, useValue: pqrsServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ToastController, useValue: toastControllerMock },
        { provide: NavController, useValue: navControllerMock }
      ]
    }).createComponent(HistorialPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
