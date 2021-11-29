import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Quill from 'quill';
import { UsuarioService } from 'src/app/login/usuario.service';
import Swal from 'sweetalert2';
import { Foro } from '../foro';
import { NuevoForoService } from './nuevo-foro.service';
@Component({
  selector: 'app-nuevo-foro',
  templateUrl: './nuevo-foro.component.html',
  styleUrls: ['./nuevo-foro.component.css'],
})
export class NuevoForoComponent implements OnInit, AfterViewInit {
  quill: any = {};
  foro: Foro = new Foro();
  @ViewChild('content', { static: false }) contenidoDelModal;
  ngAfterViewInit() {
    this.openLg();
  }

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private apiService: NuevoForoService,
    public usuarioService: UsuarioService
  ) {}

  openLg() {
    this.modalService.open(this.contenidoDelModal, {
      size: 'lg',
      centered: true,
    });

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
    this.quill.root.innerHTML = localStorage.getItem('entradaForo');
  }

  ngOnInit(): void {}

  public create(): void {
    let a,e,i,o,u,n;
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';

    var html = this.quill.root.innerHTML;
    const decodedHtml = html.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    this.foro.contenido = decodedHtml;
    this.foro.createAt = new Date();
    if (this.usuarioService.estaAutenticado()) {
      // this.foro.createBy = this.usuarioService.usuario.nombre;
      a = this.usuarioService.usuario.nombre.replace(/Ã¡/g, 'á');
      e = a.replace(/Ã©/g, 'é');
      i = e.replace(/Ã/g, 'í');
      o = i.replace(/Ã³/g, 'ó');
      u = o.replace(/Ãº/g, 'ú');
      n = u.replace(/Ã±/g, 'ñ');
      this.foro.createBy = n;
      this.foro.email = this.usuarioService.usuario.correo;
    } else {
      this.foro.createBy = 'Usuario anónimo';
    }
    if (this.foro.tema == '' || this.foro.contenido == '<p><br></p>') {
      Swal.fire('Campos vacios', `Todos los campos son obligatorios`, 'error');
    } else {
      this.apiService.create(this.foro).subscribe((response) => {
        this.router.navigate(['/foros']),
          this.apiService
            .sendMail(this.foro.tema, this.foro.createBy)
            .subscribe();
      });
      localStorage.clear();
      Swal.fire('Foro agregado', `!El foro fué agregado con éxito!`, 'success');
    }
  }

  iniciarSesion() {
    var html = this.quill.root.innerHTML;
    const decodedHtml = html.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    localStorage.setItem('entradaForo', decodedHtml);
    this.router.navigate(['/login']);
  }

  continuarAnonimo(){
    (<HTMLInputElement> document.getElementById("btnCreate")).disabled = false;
  }
}
