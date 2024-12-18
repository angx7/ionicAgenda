import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Task } from '../interfaces/Task.interface';
import { User } from '../interfaces/User.interface';

@Component({
  selector: 'app-new-task-modal',
  templateUrl: './new-task-modal.page.html',
  styleUrls: ['./new-task-modal.page.scss'],
})
export class NewTaskModalPage {
  @Input() userCorreo: string | undefined;
  task: Task = {
    id: 0,
    title: '',
    frequency: '',
    time: '',
    days: [],
    completed: false,
  };

  constructor(private modalController: ModalController) {}

  dismissModal() {
    this.modalController.dismiss();
  }

  saveTask() {
    if (this.userCorreo) {
      const storedUsers = localStorage.getItem('users');
      const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];

      const userIndex = users.findIndex(
        (user) => user.correo === this.userCorreo
      );
      if (userIndex !== -1) {
        const user = users[userIndex];

        this.task.id = user.tasks.length
          ? user.tasks[user.tasks.length - 1].id + 1
          : 1;
        user.tasks.push(this.task);

        users[userIndex] = user;
        localStorage.setItem('users', JSON.stringify(users));
        this.dismissModal();
      } else {
        console.error('User not found');
      }
    } else {
      console.error('No user email provided');
    }
  }
}
