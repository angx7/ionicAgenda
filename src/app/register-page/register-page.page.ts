import { Component } from '@angular/core';
import { User } from '../interfaces/User.interface';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {
    this.nombre = '';
    this.correo = '';
    this.pais = '';
    this.estado = '';
    this.direccion = '';
    this.telefono = '';
    this.genero = '';
    this.fechaNacimiento = new Date();
    this.estadoCivil = '';
  }

  addUser(_t8: NgForm) {
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
    };

    this.users.push(newUser);
    localStorage.setItem('users', JSON.stringify(this.users));
    // const storedUsers = localStorage.getItem('users');
    // if (storedUsers) {
    //   console.log(storedUsers);
    // }
  }
}
