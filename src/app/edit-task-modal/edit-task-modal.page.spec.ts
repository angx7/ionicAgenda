import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditTaskModalPage } from './edit-task-modal.page';

describe('EditTaskModalPage', () => {
  let component: EditTaskModalPage;
  let fixture: ComponentFixture<EditTaskModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTaskModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
