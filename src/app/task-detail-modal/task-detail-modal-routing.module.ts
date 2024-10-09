import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskDetailModalPage } from './task-detail-modal.page';

const routes: Routes = [
  {
    path: '',
    component: TaskDetailModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskDetailModalPageRoutingModule {}
