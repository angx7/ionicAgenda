import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Task } from '../interfaces/Task.interface';
import { EditTaskModalPage } from '../edit-task-modal/edit-task-modal.page';

@Component({
  selector: 'app-task-detail-modal',
  templateUrl: './task-detail-modal.page.html',
  styleUrls: ['./task-detail-modal.page.scss'],
})
export class TaskDetailModalPage {
  @Input() task: Task | undefined;
  @Input() userCorreo: string | undefined;
  constructor(private modalController: ModalController) {}

  async editModal(task: Task | undefined) {
    const clonedTask = { ...task };
    const modal = await this.modalController.create({
      component: EditTaskModalPage,
      componentProps: { task: clonedTask },
    });
    // modal.onDidDismiss().then((data) => {
    //   if (data.data) {
    //     this.task = data.data;
    //     this.updateLocalStorage();
    //     this.modalController.dismiss(this.task); // Pasar la tarea actualizada de vuelta a la página de inicio
    //   }
    // });

    return await modal.present();
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  updateLocalStorage() {
    if (this.userCorreo !== undefined) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex(
        (user: any) => user.correo === this.userCorreo
      );
      if (userIndex !== -1) {
        const taskIndex = users[userIndex].tasks.findIndex(
          (t: Task) => t.title === this.task?.title
        );
        if (taskIndex !== -1) {
          users[userIndex].tasks[taskIndex] = this.task;
          localStorage.setItem('users', JSON.stringify(users));
        }
      }
    }
  }
}
