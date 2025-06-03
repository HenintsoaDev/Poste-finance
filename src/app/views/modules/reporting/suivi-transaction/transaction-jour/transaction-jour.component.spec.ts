import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionJourComponent } from './transaction-jour.component';

describe('TransactionJourComponent', () => {
  let component: TransactionJourComponent;
  let fixture: ComponentFixture<TransactionJourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionJourComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionJourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
