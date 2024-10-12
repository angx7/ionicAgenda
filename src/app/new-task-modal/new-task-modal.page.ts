import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Task } from '../interfaces/Task.interface';
import { User } from '../interfaces/User.interface';

@Component({
  selector: 'app-new-task-modal',
  templateUrl: './new-task-modal.page.html',
  styleUrls: ['./new-task-modal.page.scss'],
})
export class NewTaskModalPage implements OnInit {
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

  ngOnInit() {
    console.log('Correo recibido', this.userCorreo);
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  saveTask1() {
    if (this.userCorreo) {
      const storedTasks = localStorage.getItem(this.userCorreo);
      const tasks: Task[] = storedTasks ? JSON.parse(storedTasks) : [];

      console.log('Tareas antes de agregar:', tasks);

      this.task.id = tasks.length ? tasks[tasks.length - 1].id + 1 : 1;
      tasks.push(this.task);

      console.log('Tareas después de agregar:', tasks);

      localStorage.setItem(this.userCorreo, JSON.stringify(tasks));
      this.dismissModal();
      console.log(this.task);
    } else {
      console.error('No user email provided');
    }
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
        console.log('Tareas antes de agregar:', user.tasks);

        this.task.id = user.tasks.length
          ? user.tasks[user.tasks.length - 1].id + 1
          : 1;
        user.tasks.push(this.task);

        console.log('Tareas después de agregar:', user.tasks);

        users[userIndex] = user;
        localStorage.setItem('users', JSON.stringify(users));
        this.dismissModal();
        console.log(this.task);
      } else {
        console.error('User not found');
      }
    } else {
      console.error('No user email provided');
    }
  }
}
