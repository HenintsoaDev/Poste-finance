import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleveCompteComponent } from './releve-compte.component';

describe('ReleveCompteComponent', () => {
  let component: ReleveCompteComponent;
  let fixture: ComponentFixture<ReleveCompteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReleveCompteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReleveCompteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
