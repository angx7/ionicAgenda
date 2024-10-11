import { Component } from '@angular/core';
import { User } from '../interfaces/User.interface';
import { Task } from '../interfaces/Task.interface';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.page.html',
  styleUrls: ['./register-page.page.scss'],
})
export class RegisterPagePage {
  goBack() {
    this.router.navigate(['/']);
  }

  nombre: string;
  correo: string;
  pais: string;
  estado: string;
  direccion: string;
  telefono: string;
  genero: string;
  fechaNacimiento: Date;
  estadoCivil: string;

  // implementación de la interfaz User.interface.ts
  users: User[] = [];
  tasks: Task[] = [];

  constructor(
    private router: Router,
    private alertController: AlertController
  ) {
    this.nombre = '';
    this.correo = '';
    this.pais = '';
    this.estado = '';
    this.direccion = '';
    this.telefono = '';
    this.genero = '';
    this.fechaNacimiento = new Date();
    this.estadoCivil = '';
    this.tasks = [];
  }

  async addUser(_t8: NgForm) {
    const defaultTask: Task = {
      title: 'Tarea 1',
      frequency: 'Semanal',
      time: '12:00',
      days: ['Monday', 'Wednesday'],
      completed: true,
    };

    const newUser: User = {
      nombre: this.nombre,
      correo: this.correo,
      pais: this.pais,
      estado: this.estado,
      direccion: this.direccion,
      telefono: this.telefono,
      genero: this.genero,
      fechaNacimiento: this.fechaNacimiento,
      estadoCivil: this.estadoCivil,
      tasks: [defaultTask],
    };

    if (await this.validateUser(newUser, _t8)) {
      this.users.push(newUser);
      localStorage.setItem('users', JSON.stringify(this.users));
      const userLogg = this.correo;
      const alert = await this.alertController.create({
        header: 'Bienvenido',
        message: userLogg,
        buttons: [
          {
            text: 'OK',
            handler: () => {
              this.addTaskToUser;
              this.router.navigate(['/home'], { state: { user: newUser } });
            },
          },
        ],
      });

      await alert.present();
      _t8.reset();
    }
  }

  async validateUser(newUser: User, _t8: NgForm): Promise<boolean> {
    let userFound: User[] = [];
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      userFound = JSON.parse(storedUsers);
      const found = userFound.some((user) => newUser.correo === user.correo);
      console.log(found);
      if (found) {
        const alertError = await this.alertController.create({
          header: 'Correo ya registrado',
          message:
            'El correo que estas intentando registrar ya existe, inicia sesión',
          buttons: [
            {
              text: 'OK',
              handler: () => {
                _t8.reset();
              },
            },
          ],
        });

        await alertError.present();
        return false;
      }
    }
    return true;
  }

  addTaskToUser(email: string, task: Task) {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u) => u.correo === email);
    if (user) {
      user.tasks.push(task);
      localStorage.setItem('users', JSON.stringify(users));
    }
  }
}
