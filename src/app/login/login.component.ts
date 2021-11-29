import { Component, OnInit } from '@angular/core';
import { Usuario } from './usuario';
import Swal from 'sweetalert2';
import { UsuarioService } from './usuario.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  usuario: Usuario;

  constructor(private usuarioService: UsuarioService, private router: Router,private location: Location) {
    this.usuario = new Usuario();
  }

  login(): void {
    //console.log();

    if (this.usuario.correo == null || this.usuario.password == null) {
      Swal.fire('Correo o contraseña vacías!', '', 'error');
      return;
    }

    this.usuarioService.login(this.usuario).subscribe(
      (respuesta) => {
        //console.log(respuesta);
        // tslint:disable-next-line:quotemark
        // tslint:disable-next-line:prefer-const
        // tslint:disable-next-line:quotemark
        //let payload = JSON.parse(atob(respuesta.access_token.split(".")[1]));
        // tslint:disable-next-line:prefer-const
        this.usuario = this.usuarioService.usuario;

        this.usuarioService.guardarUsuario(respuesta.access_token);
        this.usuarioService.guardarToken(respuesta.access_token);

        // tslint:disable-next-line:triple-equals
        // if (usuario.roles[0] == 'ROLE_LMSADMIN') {
        //   this.router.navigate(['/noticias']);
        // }
        this.location.back();
        //this.router.navigate(['/noticias']);
        // tslint:disable-next-line:triple-equals
      //  else if (usuario.roles[0] != 'ROLE_LMSADMIN') {
        //  this.router.navigate(['/registro']);
        //}
        // Swal.fire('Login', 'Hola ' + usuario.nombre, 'info');
      },
      (error) => {
        if (error.status == 400) {
          Swal.fire('Error', 'Corro o contraseña incorrectas!', 'error');
        }
      }
    );
  }

  ngOnInit(): void {
    // if (this.usuarioService.estaAutenticado()) {
    //   if (this.usuarioService.obtenerRol()) {
    //     this.router.navigate(['/registro']);
    //   } else {
    //     this.router.navigate(['/admin']);
    //   }
    // }
  }
}
