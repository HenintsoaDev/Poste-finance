import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailRetraitComponent } from './detail-retrait.component';

describe('DetailRetraitComponent', () => {
  let component: DetailRetraitComponent;
  let fixture: ComponentFixture<DetailRetraitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailRetraitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailRetraitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
