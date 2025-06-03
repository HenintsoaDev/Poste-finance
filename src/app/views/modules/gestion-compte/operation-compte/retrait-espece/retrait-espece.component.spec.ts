import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetraitEspeceComponent } from './retrait-espece.component';

describe('RetraitEspeceComponent', () => {
  let component: RetraitEspeceComponent;
  let fixture: ComponentFixture<RetraitEspeceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetraitEspeceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetraitEspeceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
