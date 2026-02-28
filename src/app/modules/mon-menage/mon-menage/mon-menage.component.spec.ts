import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonMenageComponent } from './mon-menage.component';

describe('MonMenageComponent', () => {
  let component: MonMenageComponent;
  let fixture: ComponentFixture<MonMenageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonMenageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MonMenageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
