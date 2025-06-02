import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RechargementEspeceComponent } from './rechargement-espece.component';

describe('RechargementEspeceComponent', () => {
  let component: RechargementEspeceComponent;
  let fixture: ComponentFixture<RechargementEspeceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RechargementEspeceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RechargementEspeceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
