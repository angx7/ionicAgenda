import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewTaskModalPage } from './new-task-modal.page';

describe('NewTaskModalPage', () => {
  let component: NewTaskModalPage;
  let fixture: ComponentFixture<NewTaskModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTaskModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
