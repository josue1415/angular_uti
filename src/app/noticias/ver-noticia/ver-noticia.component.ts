import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Noticias } from '../noticias';
import swal from 'sweetalert2';
import { VerNoticiaService } from './ver-noticia.service';
import { UsuarioService } from 'src/app/login/usuario.service';

@Component({
  selector: 'app-ver-noticia',
  templateUrl: './ver-noticia.component.html',
  styleUrls: ['./ver-noticia.component.scss'],
})
export class VerNoticiaComponent implements OnInit {
  id: any;
  data: Array<Noticias> = [];
  noticia: Array<Noticias> = [];
  page: any;
  loadingRouteConfig: boolean = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private noticeService: VerNoticiaService,
    public router: Router,
    public usuarioService: UsuarioService
  ) { this.loadingRouteConfig = true;}

  ngOnInit(): void {
    // Capturo el id de la noticia que mostraré
    this.activatedRoute.paramMap.subscribe((params) => {
      this.page = params.get('page');
      try {
        this.id = atob(params.get('id') || '');
      } catch (error) {}
      if (this.id) {
        this.noticeService
          .getIndice(this.id)
          .subscribe((api) => {(this.data = api),  this.loadingRouteConfig = false;});
      }
    });
  }

  delete(noticia: Noticias) {
    swal
      .fire({
        title: '¿Está seguro de eliminar definitivamente la noticia?',
        text: '¡No podrá revertir la acción!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '¡Si, eliminar!',
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.noticeService.delete(noticia.id).subscribe((response) => {
            swal.fire('¡Eliminado!', 'La noticia fué eliminada.', 'success');
            this.router.navigate(['/noticias']);
          });
        }
      });
  }

  return(page: number) {
    this.router.navigate(['/noticias', page]);
  }
}
