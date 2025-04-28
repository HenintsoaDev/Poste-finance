import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonetiqueComponent } from './monetique.component';

describe('MonetiqueComponent', () => {
  let component: MonetiqueComponent;
  let fixture: ComponentFixture<MonetiqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonetiqueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonetiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
