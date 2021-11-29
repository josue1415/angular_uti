import { Component, OnInit, AfterContentInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Contenido } from './contenido';
import { ContenidoService } from './contenido.service';
import { CookieService } from 'ngx-cookie-service';
import { UsuarioService } from 'src/app/login/usuario.service';

@Component({
  selector: 'app-contenido',
  templateUrl: './contenido.component.html',
  styleUrls: ['./contenido.component.scss'],
})
export class ContenidoComponent implements OnInit {
  // Obtiene todos los videos
  ObjectContentAPI: Array<Contenido> = [];
  // Obtiene solo los videos segun el indice_video
  ContentbyId: Array<Contenido> = new Array<Contenido>();

  id: any;
  idVideo: number = 1;
  cont: number = 0;
  loadingRouteConfig: boolean = true;
  

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ContenidoService,
    public usuarioService: UsuarioService
  ) {this.loadingRouteConfig = true;}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      // Capturo el id para saber a que categoria pertenece el video
      this.id = atob(params.get('id') || '');

      // Obtengo todos los videos por medio de la API REST
      this.apiService
        .getIndice(this.id)
        .subscribe((api) => (this.ObjectContentAPI = api , this.ifIdIsNull(api), this.cont = 0, this.loadingRouteConfig = false));
    });
  }

  ifIdIsNull(id){
    if (id[0]) {
      this.idVideo = this.ObjectContentAPI[0].id 
    }
  }
  toVideo(id: number) {
    this.idVideo = id;
    this.cont = id;
    
    var elmnt = document.getElementById("content");
    elmnt?.scrollIntoView(false);
  }

  delete(id: number) {
    
    Swal.fire({
      title: '¿Está seguro?',
      text: '¡No podrá revertir la acción!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, eliminar!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.delete(id).subscribe((response) => {
          Swal.fire('¡Eliminado!', 'El foro fué eliminado.', 'success');
          window.location.reload();
        });
      }
    });
  }
}
