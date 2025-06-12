import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailRechargementComponent } from './detail-rechargement.component';

describe('DetailRechargementComponent', () => {
  let component: DetailRechargementComponent;
  let fixture: ComponentFixture<DetailRechargementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailRechargementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailRechargementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
