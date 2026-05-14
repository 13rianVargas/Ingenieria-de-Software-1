import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { DetallePage } from './detalle.page';
import { PQRSService } from '../../core/services/pqrs.service';

describe('DetallePage', () => {
  let component: DetallePage;
  let fixture: ComponentFixture<DetallePage>;

  const pqrsServiceMock = {
    obtenerPorRadicado: jasmine.createSpy('obtenerPorRadicado'),
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
