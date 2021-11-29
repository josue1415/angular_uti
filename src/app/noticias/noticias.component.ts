import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router';
import { NgsRevealConfig } from 'ngx-scrollreveal';
import { Noticias } from './noticias';
import { NoticiasService } from './noticias.service';
import { UsuarioService } from '../login/usuario.service';

@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.component.html',
  styleUrls: ['./noticias.component.scss'],
  providers: [NgsRevealConfig],
})
export class NoticiasComponent implements OnInit {
  data!: Noticias[];
  page: any;
  collection: any[] = this.data;
  loadingRouteConfig: boolean = true;

  constructor(
    private _router: Router,
    private apiService: NoticiasService,
    private activatedRoute: ActivatedRoute,
    public usuarioService: UsuarioService
  ) {
    this.loadingRouteConfig = true;
  }

  session = { active: 'active' };
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      if (params.get('page')) {
        this.page = params.get('page');
      } else {
        this.page = 1;
      }
      this.apiService
        .getIndice()
        .subscribe((api) => {(this.data = api.reverse()), this.loadingRouteConfig=false});
    });
  }

  // Convertimos el parametro de url a base 64
  showNotice(id: any, page: number) {
    this._router.navigate(['/noticia', btoa(id), page]);
  }
}
