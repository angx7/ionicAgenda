import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Task } from '../interfaces/Task.interface';
import { EditTaskModalPage } from '../edit-task-modal/edit-task-modal.page';

@Component({
  selector: 'app-task-detail-modal',
  templateUrl: './task-detail-modal.page.html',
  styleUrls: ['./task-detail-modal.page.scss'],
})
export class TaskDetailModalPage implements OnInit {
  @Input() task: Task | undefined;
  @Input() userCorreo: string | undefined;
  constructor(private modalController: ModalController) {}
  ngOnInit() {
    console.log('Correo recibido', this.userCorreo);
  }

  completeTask(task: Task | undefined) {
    if (task) {
      task.completed = task.completed ? false : true;
      this.updateLocalStorage();
      console.log('Tarea completada:', task);
    } else {
      console.error('No se pudo completar la tarea: tarea indefinida');
    }
  }

  async editModal(task: Task | undefined) {
    const clonedTask = { ...task };
    const modal = await this.modalController.create({
      component: EditTaskModalPage,
      componentProps: { task: clonedTask, userCorreo: this.userCorreo },
    });

    console.log('Usuario antes de editar:', this.userCorreo);
    console.log('Tarea antes de editar:', clonedTask);

    modal.onDidDismiss().then((data) => {
      if (data.data) {
        this.task = data.data;
        this.updateLocalStorage();
        this.modalController.dismiss(this.task); // Pasar la tarea actualizada de vuelta a la página de inicio
      }
    });

    // modal.onDidDismiss().then((data) => {
    //   if (data.data) {
    //     this.task = data.data;

    //     const users = JSON.parse(localStorage.getItem('users') || '[]');
    //     const userIndex = users.findIndex(
    //       (user: any) => user.correo === this.userCorreo
    //     );
    //     if (userIndex !== -1) {
    //       console.log('Usuario antes de actualizar:', users[userIndex]);
    //       console.log('Tareas antes de actualizar:', users[userIndex].tasks);
    //     }
    //     this.updateLocalStorage();
    //     this.modalController.dismiss(this.task); // Pasar la tarea actualizada de vuelta a la página de inicio
    //     const updatedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    //     const updatedUserIndex = updatedUsers.findIndex(
    //       (user: any) => user.correo === this.userCorreo
    //     );
    //     if (updatedUserIndex !== -1) {
    //       console.log(
    //         'Usuario después de actualizar:',
    //         updatedUsers[updatedUserIndex]
    //       );
    //       console.log(
    //         'Tareas después de actualizar:',
    //         updatedUsers[updatedUserIndex].tasks
    //       );
    //     }
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
          (t: Task) => t.id === this.task?.id
        );
        if (taskIndex !== -1) {
          users[userIndex].tasks[taskIndex] = this.task;
          localStorage.setItem('users', JSON.stringify(users));
        }
      }
    }
  }
  // updateLocalStorage() {
  //   if (this.userCorreo !== undefined) {
  //     console.log('Correo del usuario:', this.userCorreo);
  //     const users = JSON.parse(localStorage.getItem('users') || '[]');
  //     console.log('Usuarios obtenidos del localStorage:', users);
  //     const userIndex = users.findIndex(
  //       (user: any) => user.correo === this.userCorreo
  //     );
  //     console.log('Índice del usuario encontrado:', userIndex);
  //     if (userIndex !== -1) {
  //       const taskIndex = users[userIndex].tasks.findIndex(
  //         (t: Task) => t.id === this.task?.id
  //       );
  //       console.log('Índice de la tarea encontrada:', taskIndex);
  //       if (taskIndex !== -1) {
  //         users[userIndex].tasks[taskIndex] = this.task;
  //       } else {
  //         users[userIndex].tasks.push(this.task);
  //       }
  //       localStorage.setItem('users', JSON.stringify(users));
  //     }
  //   }
  // }
}
