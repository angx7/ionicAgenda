import { Task } from './Task.interface';

export interface User {
  nombre: string;
  correo: string;
  pais: string;
  estado: string;
  direccion: string;
  telefono: string;
  genero: string;
  fechaNacimiento: Date;
  estadoCivil: string;
  tasks: Task[];
}
