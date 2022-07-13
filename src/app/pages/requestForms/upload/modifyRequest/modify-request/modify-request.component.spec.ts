import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyRequestComponent } from './modify-request.component';

describe('ModifyRequestComponent', () => {
  let component: ModifyRequestComponent;
  let fixture: ComponentFixture<ModifyRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
