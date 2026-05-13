import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TramitePage } from './tramite.page';

describe('TramitePage', () => {
  let component: TramitePage;
  let fixture: ComponentFixture<TramitePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TramitePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
