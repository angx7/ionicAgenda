import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Task } from '../interfaces/Task.interface';
import { User } from '../interfaces/User.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  correo: string;
  constructor(
    private router: Router,
    private alertController: AlertController
  ) {
    this.correo = '';
  }

  async access(_t9: NgForm) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(
      (user: { correo: string }) => user.correo === this.correo
    );
    if (user) {
      this.router.navigate(['/home'], { state: { user: user } });
    } else {
      const alert = await this.alertController.create({
        header: 'Correo inválido',
        message: 'El correo que has ingresado es incorrecto, prueba de nuevo',
        buttons: ['OK'],
      });

      await alert.present();
      _t9.reset();
    }
  }

  navigateToRegister() {
    this.router.navigate(['/register-page']);
  }

  getUserTasks(email: string): Task[] {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u) => u.correo === email);
    return user ? user.tasks : [];
  }
}
