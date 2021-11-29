import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Quill from 'quill';
import Swal from 'sweetalert2';
import { Contenido } from '../contenido/contenido';
import { Indice_videos } from '../contenido/indice_videos';
import { FormService } from './form.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {
  id: any;
  id2: any = 0;
  idReturn: any;
  quill: any = {};
  noticiaGet!: Contenido[];
  noticia: Contenido = new Contenido();
  indiceP: Indice_videos = new Indice_videos();
  constructor(
    private formService: FormService,
    private router: Router,
    private activatedRouter: ActivatedRoute
  ) {
    localStorage.setItem('numeroCuentas', '0');
  }

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
    this.noticia.descripcion = decodedHtml;
    this.indiceP.id = this.id;
    this.noticia.indice_video = this.indiceP;
    if (this.noticia.tema == '' || this.noticia.enlace == '') {
      Swal.fire(
        'Rellene todos los campos!',
        'Todos los campos son obligatorios',
        'error'
      );
    } else {
      this.formService
        .create(this.noticia)
        .subscribe((response) =>
          this.router.navigate(['/indice_videos', this.idReturn])
        );
      Swal.fire(
        'Video agregado',
        `Video ${this.noticia.tema} agregado con éxito!`,
        'success'
      );
    }
  }

  cargarNoticia(): void {
    this.activatedRouter.params.subscribe((params) => {
      this.id2 = params['id2'];
      this.id = params['id'];
      this.idReturn = btoa(this.id);
      if (this.id2) {
        this.formService
          .getVideo(this.id2)
          .subscribe(
            (notice) => (
              (this.noticia = notice),
              this.quill.setContents(
                this.quill.clipboard.convert(this.noticia.descripcion)
              )
            )
          );
      }
    });
  }

  update() {
    var html = this.quill.root.innerHTML;
    const decodedHtml = html.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    this.noticia.descripcion = decodedHtml;
    if (this.noticia.tema == '' || this.noticia.enlace == '') {
      Swal.fire(
        'Rellene todos los campos!',
        'Todos los campos son obligatorios',
        'error'
      );
    } else {
      this.formService.update(this.noticia).subscribe((cliente) => {
        this.router.navigate(['/indice_videos', this.idReturn]);
        Swal.fire(
          'Video actualizado',
          `Video ${this.noticia.tema} actualizado con éxito!`,
          'success'
        );
      });
    }
  }
}
