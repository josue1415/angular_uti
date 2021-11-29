import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UsuarioService } from '../login/usuario.service';
import { HeaderService } from './header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  nameUser: string = "";
  constructor(public usuarioService: UsuarioService, private router: Router, private hs: HeaderService) {}
  logout(): void {
    this.usuarioService.logout();
    this.router.navigate(['/login']);
  }
  ngOnInit(): void {
    this.nameUser = decodeURIComponent(this.usuarioService.usuario.nombre);
  }

  verificarPass(p1:string,p2:string): void{
    if(p1==p2){
      if(p1.length<6 || p2.length<6){
        Swal.fire("Error","La contraseña debe tener 6 caracteres o más","error");
      }
      else{
        this.hs.actualizarContraseña(p1).subscribe();
        Swal.fire("Hecho","La contraseña se actualizo correctamente","success");
        this.logout();

      }
      
    }
    else{
      Swal.fire("Error","Las contraseñas no coincicen","error");
    }
  }
}
