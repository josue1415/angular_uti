import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Noticias } from '../noticias';
import { NoticiasService } from '../noticias.service';
import { DataTablesModule } from 'angular-datatables';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { NuevaNoticiaService } from '../nueva-noticia/nueva-noticia.service';
import { Router } from '@angular/router';
import { VerNoticiaService } from '../ver-noticia/ver-noticia.service';
import { UsuarioService } from 'src/app/login/usuario.service';

@Component({
  selector: 'app-vigencia',
  templateUrl: './vigencia.component.html',
  styleUrls: ['./vigencia.component.css'],
})
export class VigenciaComponent implements OnInit, OnDestroy {
  dtOptions: DataTables.Settings = {};
  noticias: Noticias[] = [];
  expiredNotice: Noticias[] = [];
  myEventSubscription: any;
  myEventSubscription2: any;
  noticia: Noticias = new Noticias();

  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(
    private apiService: NoticiasService,
    private modalService: NgbModal,
    private updateService: NuevaNoticiaService,
    private router: Router,
    private deleteService: VerNoticiaService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 3,
      autoWidth: false,
      responsive: true,
      order: [],
      /* below is the relevant part, e.g. translated to spanish */
      language: {
        processing: 'Procesando...',
        search: 'Buscar:',
        lengthMenu: 'Mostrar _MENU_ elementos',
        info: 'Mostrando desde _START_ a _END_ de _TOTAL_ elementos',
        infoEmpty: 'Mostrando ningún elemento.',
        infoFiltered: '(filtrado _MAX_ elementos total)',
        infoPostFix: '',
        loadingRecords: 'Cargando registros...',
        zeroRecords: '¡No se encontraron registros!',
        emptyTable: '¡No hay datos disponibles en la tabla!',
        paginate: {
          first: 'Primero',
          previous: 'Anterior',
          next: 'Siguiente',
          last: 'Último',
        },
        aria: {
          sortAscending: ': Activar para ordenar la tabla en orden ascendente',
          sortDescending:
            ': Activar para ordenar la tabla en orden descendente',
        },
      },
    };
    this.loadTables();
  }

  loadTables(): void {
    this.myEventSubscription = this.apiService.getIndice().subscribe((data) => {
      this.noticias = data;
      this.dtTrigger.next();
    });
    this.myEventSubscription2 = this.apiService
      .getExpiredNews()
      .subscribe((data) => {
        this.expiredNotice = data;
      });
  }

  triggerModal(content: any) {
    this.modalService.open(content, { size: 'xl' });
  }

  expire(noticia: Noticias) {
    this.noticia.id = noticia.id;
    this.noticia.contenido = noticia.contenido;
    this.noticia.img_principal = noticia.img_principal;
    this.noticia.tema = noticia.tema;
    this.noticia.createAt = noticia.createAt;
    this.noticia.expired = true;
    this.noticia.dateExpire = new Date();
    this.noticia.deleteBy = this.usuarioService.usuario.nombre; //This name is the user
    // console.log(this.noticia);
    Swal.fire({
      title: '¿Está seguro?',
      text: '!Podrá revertir la acción en VER NOTICIAS EXPIRADAS!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, quitar noticia!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.updateService.update(this.noticia).subscribe(() => {
          Swal.fire(
            '¡Actualizado!',
            'La noticia no aparecerá en el Boletín.',
            'success'
          );
          let currentUrl = this.router.url;
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate([currentUrl]);
        });
      }
    });
    // this.router.navigate(['/noticias']);
  }

  vigente(noticia: Noticias) {
    this.noticia.id = noticia.id;
    this.noticia.contenido = noticia.contenido;
    this.noticia.img_principal = noticia.img_principal;
    this.noticia.tema = noticia.tema;
    this.noticia.createAt = noticia.createAt;
    this.noticia.expired = false;
    this.noticia.deleteBy = "";
    Swal.fire({
      title: '¿Está seguro?',
      text: '¡La noticia aparecerá en el boletín!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, restaurar noticia!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.updateService.update(this.noticia).subscribe(() => {
          Swal.fire(
            '¡Actualizado!',
            'La noticia aparecerá en el Boletín.',
            'success'
          );
          this.modalService.dismissAll();
          let currentUrl = this.router.url;
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate([currentUrl]);
        });
      }
    });
    // this.router.navigate(['/noticias']);
  }

  delete(noticia: Noticias) {
    Swal
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
          this.deleteService.delete(noticia.id).subscribe((response) => {
            Swal.fire('¡Eliminado!', 'La noticia fué eliminada.', 'success');
            this.router.navigate(['/noticias']);
          });
        }
      });
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
    if (this.myEventSubscription) {
      this.myEventSubscription.unsubscribe();
    }
    if (this.myEventSubscription2) {
      this.myEventSubscription2.unsubscribe();
    }
  }
}
