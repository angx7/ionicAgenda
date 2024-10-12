import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'register-page',
    loadChildren: () => import('./register-page/register-page.module').then( m => m.RegisterPagePageModule)
  },
  {
    path: 'task-detail-modal',
    loadChildren: () => import('./task-detail-modal/task-detail-modal.module').then( m => m.TaskDetailModalPageModule)
  },
  {
    path: 'edit-task-modal',
    loadChildren: () => import('./edit-task-modal/edit-task-modal.module').then( m => m.EditTaskModalPageModule)
  },
  {
    path: 'new-task-modal',
    loadChildren: () => import('./new-task-modal/new-task-modal.module').then( m => m.NewTaskModalPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
