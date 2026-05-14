import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { DetallePage } from './detalle.page';
import { PQRSService } from '../../core/services/pqrs.service';

describe('DetallePage', () => {
  let component: DetallePage;
  let fixture: ComponentFixture<DetallePage>;

  const pqrsServiceMock = {
    obtenerPorRadicado: jasmine.createSpy('obtenerPorRadicado').and.returnValue(
      of({ success: true, data: { radicado: '10025', tipo: 'RECLAMO', estado: 'NUEVO', comentarios: 'Test', fecha: new Date(), clienteNombre: 'Test', clienteIdentificacion: '12345678' } })
    ),
    descargarAnexo: jasmine.createSpy('descargarAnexo').and.returnValue(of(new Blob()))
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

  beforeEach(async () => {
    fixture = TestBed.configureTestingModule({
      declarations: [DetallePage],
      providers: [
        { provide: PQRSService, useValue: pqrsServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).createComponent(DetallePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
