import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Quill from 'quill';
import { Noticias } from '../noticias';
import { NuevaNoticiaService } from './nueva-noticia.service';
import swal from 'sweetalert2';
import { Location } from '@angular/common';

@Component({
  selector: 'app-nueva-noticia',
  templateUrl: './nueva-noticia.component.html',
  styleUrls: ['./nueva-noticia.component.css'],
})
export class NuevaNoticiaComponent implements OnInit, AfterViewInit {
  quill: any = {};
  noticiaGet!: Noticias[];
  noticia: Noticias = new Noticias();

  constructor(
    private noticeService: NuevaNoticiaService,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private location: Location,
  ) {}

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    var toolbarOptions = [
      ['bold', 'italic', 'underline', 'strike'], // toggled buttons
      ['code-block', 'link', 'video'],

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

    this.cargarNoticia();
  }

  public create(): void {
    var html = this.quill.root.innerHTML;
    const decodedHtml = html.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    this.noticia.contenido = decodedHtml;
    this.noticia.createAt = new Date();
    if (
      this.noticia.tema == '' ||
      this.noticia.img_principal == '' ||
      this.noticia.contenido == '<p><br></p>'
    ) {
      swal.fire('Campos vacios', `Todos los campos son obligatorios`, 'error');
    } else {
      this.noticeService
        .create(this.noticia)
        .subscribe((response) => this.router.navigate(['/noticias']));
      swal.fire(
        'Noticia agregada',
        `Noticia ${this.noticia.tema} agregada con éxito!`,
        'success'
      );
    }
  }

  cargarNoticia(): void {
    this.activatedRouter.params.subscribe((params) => {
      let id = params['id'];
      if (id) {
        this.noticeService
          .getNoticia(id)
          .subscribe(
            (notice) => (
              (this.noticia = notice),
              this.quill.setContents(
                this.quill.clipboard.convert(this.noticia.contenido)
              )
            )
          );
      }
    });
  }

  update() {
    var html = this.quill.root.innerHTML;
    const decodedHtml = html.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    this.noticia.contenido = decodedHtml;
    if (
      this.noticia.tema == '' ||
      this.noticia.img_principal == '' ||
      this.noticia.contenido == '<p><br></p>'
    ) {
      swal.fire('Campos vacios', `Todos los campos son obligatorios`, 'error');
    } else {
      this.noticeService.update(this.noticia).subscribe((cliente) => {
        this.router.navigate(['/noticias']);
        swal.fire(
          'Noticia actualizada',
          `Noticia ${this.noticia.tema} actualizada con éxito!`,
          'success'
        );
      });
    }
  }

  cancelar() {
    this.location.back();
  }
}
