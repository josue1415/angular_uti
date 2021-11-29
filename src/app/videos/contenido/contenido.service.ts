import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EmptyError, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UsuarioService } from 'src/app/login/usuario.service';
import { Contenido } from './contenido';

@Injectable({
  providedIn: 'root',
})
export class ContenidoService {
  id: any;
  ContentbyId: any = [];

  constructor(private http: HttpClient, private usuarioService: UsuarioService, private router: Router) {}

  private urlEndPoint: string = 'http://localhost:8080/api/videos';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  getIndice(id: any): Observable<Contenido[]> {
    // return this.http.get<Contenido[]>(this.urlEndPoint);
    this.ContentbyId = [];
    return this.http.get<Contenido[]>(this.urlEndPoint).pipe(
      map((response) => {
        let videos = response as Contenido[];
        for (const data of videos) {
          if (data.indice_video.id == id) {
            this.ContentbyId.push(data);
          }
        }
        return this.ContentbyId;
      })
    );
  }

  delete(id: number): Observable<Contenido> {
    return this.http.delete<Contenido>(`${this.urlEndPoint}/${id}`, {
      headers: this.agregarAuthorizationHeader(),
    }).pipe(
      catchError(
        e => {
          this.sinAutorizacion(e);
          return throwError(e);

        }
    ));
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
      this.router.navigate(['/login']);
      return true;
    }
    return false;
  }

}
