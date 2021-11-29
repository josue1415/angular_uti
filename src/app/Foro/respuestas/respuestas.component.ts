import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Quill from 'quill';
import { UsuarioService } from 'src/app/login/usuario.service';
import Swal from 'sweetalert2';
import { Foro } from '../foro';
import { Respuestas } from './respuestas';
import { RespuestasService } from './respuestas.service';

@Component({
  selector: 'app-respuestas',
  templateUrl: './respuestas.component.html',
  styleUrls: ['./respuestas.component.scss'],
})
export class RespuestasComponent implements OnInit {
  quill: any = {};
  id: any;
  respuestas!: Respuestas[];
  foro: any = [];
  getForo!: Respuestas[];
  respuesta: Respuestas = new Respuestas();
  page: number = 1;
  idAux: String = '';
  emisor: String = '';
  loadingRouteConfig: boolean = true;

  constructor(
    private apiService: RespuestasService,
    private activatedRouter: ActivatedRoute,
    private router: Router,
    private location: Location,
    public usuarioService: UsuarioService
  ) { this.loadingRouteConfig = true;}

  ngOnInit(): void {
    this.cargarRespuesta();

    var toolbarOptions = [
      ['bold', 'italic', 'underline', 'strike'], // toggled buttons
      ['code-block'],

      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
      [{ indent: '-1' }, { indent: '+1' }], // outdent/indent

      [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],

      ['clean'], // remove formatting button
    ];

    this.quill = new Quill('#editor', {
      modules: {
        toolbar: toolbarOptions,
      },
      theme: 'snow',
    });

    this.quill.root.innerHTML = localStorage.getItem('respuesta');
  }

  cargarRespuesta() {
    this.activatedRouter.params.subscribe((params) => {
      try {
        this.id = atob(params['id'] || '');
        this.idAux = this.router.url.slice(18, -2);
      } catch (error) {}
      this.page = params['page'];
      if (this.id) {
        this.apiService
          .getRespuestas(this.id)
          .subscribe((api) => {(this.respuestas = api),  this.loadingRouteConfig = false;});
        this.apiService
          .getForo(this.id)
          .subscribe(
            (apiforo) => (this.notNull(apiforo), (this.getForo = apiforo))
          );
      }
    });
  }

  notNull(apiForo) {
    if (apiForo) {
      this.foro = Array.of(apiForo);
    } else {
      this.foro = new Foro();
    }
  }

  return() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.navigate(['/foros', this.page]);
    localStorage.clear();
    //this.location.back();
  }

  enableButton() {
    if (document.getElementById('btnAddResp')) {
    } else {
    }
  }

  public create(): void {
    let a,e,i,o,u,n;
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => true;
    this.router.onSameUrlNavigation = 'reload';

    var html = this.quill.root.innerHTML;
    const decodedHtml = html.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    this.respuesta.respuesta = decodedHtml;
    this.respuesta.foro = this.getForo;
    if(this.usuarioService.estaAutenticado()){
      // this.respuesta.usuario = this.usuarioService.usuario.nombre.replace(/Ã¡/g, 'á');
      a = this.usuarioService.usuario.nombre.replace(/Ã¡/g, 'á');
      e = a.replace(/Ã©/g, 'é');
      i = e.replace(/Ã/g, 'í');
      o = i.replace(/Ã³/g, 'ó');
      u = o.replace(/Ãº/g, 'ú');
      n = u.replace(/Ã±/g, 'ñ');
      this.respuesta.usuario = n;
    }
    this.emisor = this.usuarioService.usuario.nombre;
    if (this.respuesta.respuesta == '<p><br></p>') {
      Swal.fire(
        '¡Necesita agregar una respuesta!',
        'Todos los campos son obligatorios',
        'error'
      );
    } else {
      this.apiService.create(this.respuesta).subscribe((response) => {
        this.router.navigate([currentUrl]),
          this.apiService
            .sendMail(this.respuesta, this.emisor, this.idAux, html)
            .subscribe();
      });
      Swal.fire(
        'Respuesta agregada',
        `¡Respuesta agregada con éxito!`,
        'success'
      );
      localStorage.clear();
      this.quill.root.innerHTML = '';
    }
  }

  delete(id: number) {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => true;
    this.router.onSameUrlNavigation = 'reload';
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
          Swal.fire('¡Eliminado!', 'La respuesta fué eliminada.', 'success');
          this.router.navigate([currentUrl]);
        });
      }
    });
  }

  iniciarSesion() {
    var html = this.quill.root.innerHTML;
    const decodedHtml = html.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    localStorage.setItem('respuesta', decodedHtml);
    this.router.navigate(['/login']);
  }

  continuarAnonimo(){
    (<HTMLInputElement> document.getElementById("btnCreate")).disabled = false;
  }
}
