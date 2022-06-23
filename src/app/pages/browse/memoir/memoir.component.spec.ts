import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemoirComponent } from './memoir.component';

describe('MemoirComponent', () => {
  let component: MemoirComponent;
  let fixture: ComponentFixture<MemoirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemoirComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemoirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
