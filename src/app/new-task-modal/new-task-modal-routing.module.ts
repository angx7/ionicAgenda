import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewTaskModalPage } from './new-task-modal.page';

const routes: Routes = [
  {
    path: '',
    component: NewTaskModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewTaskModalPageRoutingModule {}
