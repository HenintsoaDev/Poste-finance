import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesactiverCompteComponent } from './desactiver-compte.component';

describe('DesactiverCompteComponent', () => {
  let component: DesactiverCompteComponent;
  let fixture: ComponentFixture<DesactiverCompteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesactiverCompteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesactiverCompteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
