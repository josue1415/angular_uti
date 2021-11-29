import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UsuarioService } from '../login/usuario.service';
import { UpdateuserService } from './updateuser.service';
import { Usuario } from './usuario';

@Component({
  selector: 'app-actualizarpasswords',
  templateUrl: './actualizarpasswords.component.html',
  
})
export class ActualizarpasswordsComponent implements OnInit {

  public usuarios!: Usuario[];
  constructor(private user: UpdateuserService, private userService: UsuarioService, private router: Router) { }

  ngOnInit(): void {
    if(!this.userService.estaAutenticado()){

      
        this.router.navigate(['/login']);

      
     


    }
    else
    this.user.obtenerUsuariosAll().subscribe(
      user2 => this.usuarios = user2
    );



  }

  GetDataFromView(): void {
var password = $("#passwordG").val();
var correo = $("#correo").val();

if(this.user.actualizarPassword(correo+'', password+'')){
  Swal.fire( 'Contraseña actuaizada correctamente', '', 'success' );
}


  }
// genera la contraseña
  ramdomPassword(): void{
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < 8; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
// se pone la contraseña generada en el textfield
   $("#passwordG").val(result);
  }

}
