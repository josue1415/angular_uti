import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Noticias } from './noticias';
import { UsuarioService } from '../login/usuario.service';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NoticiasService {
  private urlEndPoint: string = 'http://localhost:8080/api/noticias';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(
    private http: HttpClient,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  getIndice(): Observable<Noticias[]> {
    return this.http.get<Noticias[]>(this.urlEndPoint + '/noexpired')
    
  }

  getExpiredNews(): Observable<Noticias[]> {
    return this.http.get<Noticias[]>(this.urlEndPoint + '/expired');
  }

  private agregarAuthorizationHeader() {
    let token = this.usuarioService.token;
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders;
  }

  // funcion para validar que se haya iniciado sesion
  private sinAutorizacion(e): boolean {
    if (e.status === 401 || e.status === 403) {
      this.router.navigate(['/noticias']);
      return true;
    }
    return false;
  }
}
