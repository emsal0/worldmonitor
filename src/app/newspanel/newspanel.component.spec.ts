import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewspanelComponent } from './newspanel.component';

describe('NewspanelComponent', () => {
  let component: NewspanelComponent;
  let fixture: ComponentFixture<NewspanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewspanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewspanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
