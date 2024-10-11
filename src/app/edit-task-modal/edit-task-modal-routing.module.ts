import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditTaskModalPage } from './edit-task-modal.page';

const routes: Routes = [
  {
    path: '',
    component: EditTaskModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditTaskModalPageRoutingModule {}
