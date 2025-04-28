import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RechargeEspeceComponent } from './recharge-espece.component';

describe('RechargeEspeceComponent', () => {
  let component: RechargeEspeceComponent;
  let fixture: ComponentFixture<RechargeEspeceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RechargeEspeceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RechargeEspeceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
