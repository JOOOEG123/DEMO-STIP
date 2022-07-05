import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificationRequestComponent } from './modification-request.component';

describe('ModificationRequestComponent', () => {
  let component: ModificationRequestComponent;
  let fixture: ComponentFixture<ModificationRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModificationRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificationRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
