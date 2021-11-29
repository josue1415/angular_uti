export class Usuario {
  id!: number;
  correo!: string;
  nombre: string = 'Usuario anónimo';
  password!: string;
  roles: string[] = [];
}
