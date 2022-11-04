import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSourceInputComponent } from './add-source-input.component';

describe('AddSourceInputComponent', () => {
  let component: AddSourceInputComponent;
  let fixture: ComponentFixture<AddSourceInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSourceInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSourceInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
