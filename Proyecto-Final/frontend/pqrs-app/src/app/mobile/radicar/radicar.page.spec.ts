import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
    crearPQRS: jasmine.createSpy('crearPQRS').and.returnValue(of({ success: true, data: { radicado: '12345' } })),
    validarPDF: jasmine.createSpy('validarPDF').and.returnValue(true)
  };

  const routerMock = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async () => {
    fixture = TestBed.configureTestingModule({
      declarations: [RadicarPage],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: PQRSService, useValue: pqrsServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).createComponent(RadicarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
