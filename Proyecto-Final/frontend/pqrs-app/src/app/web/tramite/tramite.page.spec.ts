import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { of } from 'rxjs';
import { TramitePage } from './tramite.page';
import { PQRSService } from '../../core/services/pqrs.service';

describe('TramitePage', () => {
  let component: TramitePage;
  let fixture: ComponentFixture<TramitePage>;

  const pqrsServiceMock = {
    obtenerPorRadicado: jasmine.createSpy('obtenerPorRadicado').and.returnValue(
      of({ success: true, data: { radicado: '10025', tipo: 'RECLAMO', estado: 'NUEVO', comentarios: 'Test', fecha: new Date(), clienteNombre: 'Test', clienteIdentificacion: '12345678', clienteEmail: 'test@test.com', clienteTelefono: '3001234567' } })
    ),
    actualizarEstado: jasmine.createSpy('actualizarEstado').and.returnValue(of({ success: true, data: { estado: 'RESUELTO' } })),
    descargarAnexo: jasmine.createSpy('descargarAnexo').and.returnValue(of(new Blob()))
  };

  const routerMock = {
    navigate: jasmine.createSpy('navigate'),
    events: of(),
    url: '/web/tramite/10025'
  };

  const activatedRouteMock = {
    snapshot: {
      paramMap: {
        get: jasmine.createSpy('get').and.returnValue('10025')
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
      declarations: [TramitePage],
      imports: [ReactiveFormsModule, IonicModule],
      providers: [
        FormBuilder,
        { provide: PQRSService, useValue: pqrsServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: NavController, useValue: navControllerMock }
      ]
    }).createComponent(TramitePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
