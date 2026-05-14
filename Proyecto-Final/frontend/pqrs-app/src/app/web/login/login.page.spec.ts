import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { LoginPage } from './login.page';
import { AuthService } from '../../core/services/auth.service';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  const authServiceMock = {
    hasValidToken: jasmine.createSpy('hasValidToken').and.returnValue(false),
    login: jasmine.createSpy('login').and.returnValue(of({ success: true, data: { user: { rol: 'GESTOR' } } })),
    getCurrentUser: jasmine.createSpy('getCurrentUser').and.returnValue(null),
    getCurrentRole: jasmine.createSpy('getCurrentRole').and.returnValue(null)
  };

  const routerMock = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async () => {
    fixture = TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
