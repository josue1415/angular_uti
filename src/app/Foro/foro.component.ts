import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UsuarioService } from '../login/usuario.service';
// import QuillType from 'quill';
import { Foro } from './foro';
import { ForoService } from './foro.service';
@Component({
  selector: 'app-foro',
  templateUrl: './foro.component.html',
  styleUrls: ['./foro.component.scss'],
})
export class ForoComponent implements OnInit {
  foro!: Foro[];
  foroSearch: any;

  page: number = 1;
  collection: any[] = this.foro;
  loadingRouteConfig: boolean = true;

  constructor(
    private apiService: ForoService,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    public usuarioService: UsuarioService
  ) {this.loadingRouteConfig = true;}

  ngOnInit(): void {
    this.activatedRouter.params.subscribe((params) => {
      if (params['page']) {
        this.page = params['page'];
      }
    }),
      this.apiService
        .getForos()
        .subscribe((api) => {(this.foroSearch = this.foro = api.reverse()), this.loadingRouteConfig = false;});
  }

  search(topic: any) {
    this.page = 1;
    this.foroSearch = this.foro.filter(function (el) {
      return el.tema.toLowerCase().indexOf(topic.toLowerCase()) > -1;
    });
  }

  delete(id: number) {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    Swal.fire({
      title: '¿Está seguro?',
      text: 'No podrá revertir la acción!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, eliminar!',
    }).then((result) => {
      if (result.isConfirmed) {
          this.apiService.delete(id).subscribe((response) => {
            Swal.fire('¡Eliminado!', 'El foro fué eliminado.', 'success');
            this.router.navigate([currentUrl]);
          });
      }
    });
  }

  redirect(id, page) {
    this.router.navigate(['/foros_respuestas', btoa(id), page]);
  }
}
