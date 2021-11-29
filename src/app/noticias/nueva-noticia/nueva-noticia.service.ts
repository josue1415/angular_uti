import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, filter } from 'rxjs/operators';
import { UsuarioService } from '../../login/usuario.service';

import { Noticias } from '../noticias';

@Injectable({
  providedIn: 'root',
})
export class NuevaNoticiaService {
  private urlEndPoint: string = 'http://localhost:8080/api/noticias';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private router: Router, private usuarioService: UsuarioService) {}

  create(noticia: Noticias): Observable<Noticias> {
    return this.http.post<Noticias>(this.urlEndPoint, noticia, {
      headers: this.agregarAuthorizationHeader(),
    }).pipe(
      catchError(
        e => {
          this.sinAutorizacion(e);
          return throwError(e);

        }
    ));
  }

  getNoticia(id: number): Observable<Noticias> {
    return this.http.get<Noticias>(`${this.urlEndPoint}/${id}`);
  }

  update(noticias: Noticias): Observable<Noticias> {
    return this.http.put<Noticias>(
      `${this.urlEndPoint}/${noticias.id}`,
      noticias, {
        headers: this.agregarAuthorizationHeader(),
      }).pipe(
        catchError(
          e => {
            this.sinAutorizacion(e);
            return throwError(e);
  
          }
      ));
  }

  // funcion para validar que se haya iniciado sesion
  private sinAutorizacion(e): boolean{
    if( e.status === 401 || e.status === 403 ){
      this.router.navigate(['/login']);
      return true;
    }
    return false;
  }

    // se ponen las cabeceras o headers para ser enviados al backend
    private agregarAuthorizationHeader(){
      let token = this.usuarioService.token;
      if(token != null){
        return this.httpHeaders.append('Authorization', 'Bearer ' + token);
      }
      return this.httpHeaders;
  
    }
}
