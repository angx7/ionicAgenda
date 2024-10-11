import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../interfaces/User.interface';
import { ModalController } from '@ionic/angular';
import { TaskDetailModalPage } from '../task-detail-modal/task-detail-modal.page';
import { Task } from '../interfaces/Task.interface';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  user: User | undefined;

  constructor(
    private router: Router,
    private modalController: ModalController,
    private cdr: ChangeDetectorRef
  ) {}

  async openModal(task: Task | undefined) {
    const modal = await this.modalController.create({
      component: TaskDetailModalPage,
      componentProps: { task, userCorreo: this.user?.correo },
    });

    // modal.onDidDismiss().then((data) => {
    //   if (data.data) {
    //     this.updateTask(data.data);
    //   }
    // });
    return await modal.present();
  }

  updateTask(updatedTask: Task) {
    if (this.user) {
      const taskIndex = this.user.tasks.findIndex(
        (t) => t.title === updatedTask.title
      );
      if (taskIndex !== -1) {
        this.user.tasks[taskIndex] = updatedTask;
        this.cdr.detectChanges(); // Forzar la detección de cambios
      }
    }
  }

  logOut() {
    this.router.navigate(['/']);
  }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.user = navigation.extras.state['user'];
      console.log('Usuario recibido:', this.user);
      if (this.user && this.user.tasks) {
        console.log('Tareas del usuario:', this.user.tasks);
      }
    }
  }
}
