import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TramitePage } from './tramite.page';
import { PQRSService } from '../../core/services/pqrs.service';

describe('TramitePage', () => {
  let component: TramitePage;
  let fixture: ComponentFixture<TramitePage>;

  const pqrsServiceMock = {
    obtenerPorRadicado: jasmine.createSpy('obtenerPorRadicado'),
    actualizarEstado: jasmine.createSpy('actualizarEstado'),
    descargarAnexo: jasmine.createSpy('descargarAnexo')
  };

  const routerMock = {
    navigate: jasmine.createSpy('navigate')
  };

  const activatedRouteMock = {
    snapshot: {
      paramMap: {
        get: jasmine.createSpy('get').and.returnValue('10025')
      }
    }
  };

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [TramitePage],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: PQRSService, useValue: pqrsServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).createComponent(TramitePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
