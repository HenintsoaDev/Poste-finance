import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaiementMasseComponent } from './paiement-masse.component';

describe('PaiementMasseComponent', () => {
  let component: PaiementMasseComponent;
  let fixture: ComponentFixture<PaiementMasseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaiementMasseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaiementMasseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
