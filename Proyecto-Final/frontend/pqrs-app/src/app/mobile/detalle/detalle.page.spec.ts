import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { of } from 'rxjs';
import { DetallePage } from './detalle.page';
import { PQRSService } from '../../core/services/pqrs.service';

describe('DetallePage', () => {
  let component: DetallePage;
  let fixture: ComponentFixture<DetallePage>;

  const pqrsServiceMock = {
    detalle: jasmine.createSpy('detalle').and.returnValue(
      of({ id: 1, radicado: '10025', tipo: 'RECLAMO', asunto: 'Test', descripcion: 'Test desc', estado: 'NUEVO', clienteId: 1, fechaRadicado: new Date(), tramites: [], adjuntos: [] })
    ),
    descargarAnexo: jasmine.createSpy('descargarAnexo').and.returnValue(of(new Blob()))
  };

  const routerMock = {
    navigate: jasmine.createSpy('navigate'),
    events: of(),
    url: '/mobile/detalle/1'
  };

  const activatedRouteMock = {
    snapshot: {
      paramMap: {
        get: jasmine.createSpy('get').and.returnValue('1')
      }
    }
  };

  const navControllerMock = {
    navigateForward: jasmine.createSpy('navigateForward'),
    navigateBack: jasmine.createSpy('navigateBack'),
    navigateRoot: jasmine.createSpy('navigateRoot')
  };

  beforeEach(async () => {
    fixture = TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [DetallePage],
      imports: [IonicModule],
      providers: [
        { provide: PQRSService, useValue: pqrsServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: NavController, useValue: navControllerMock }
      ]
    }).createComponent(DetallePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
