import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RadicarPage } from './radicar.page';

describe('RadicarPage', () => {
  let component: RadicarPage;
  let fixture: ComponentFixture<RadicarPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RadicarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
