import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChercherCompteComponent } from './chercher-compte.component';

describe('ChercherCompteComponent', () => {
  let component: ChercherCompteComponent;
  let fixture: ComponentFixture<ChercherCompteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChercherCompteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChercherCompteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
