import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UsuarioService } from 'src/app/login/usuario.service';
import Swal from 'sweetalert2';
import { Contenido } from '../contenido/contenido';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  private urlEndPoint: string = 'http://localhost:8080/api/videos';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(
    private http: HttpClient,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  create(video: Contenido): Observable<Contenido> {
    return this.http
      .post<Contenido>(this.urlEndPoint, video, {
        headers: this.agregarAuthorizationHeader(),
      })
      .pipe(
        catchError((err) => {
          this.sinAutorizacion(err);
          return throwError(err);
        })
      );
  }

  getVideo(id: number): Observable<Contenido> {
    return this.http
      .get<Contenido>(`${this.urlEndPoint}/${id}`, {
        headers: this.agregarAuthorizationHeader(),
      })
      .pipe(
        catchError((err) => {
          this.sinAutorizacion(err);
          return throwError(err);
        })
      );
  }

  update(cont: Contenido): Observable<Contenido> {
    return this.http
      .put<Contenido>(`${this.urlEndPoint}/${cont.id}`, cont, {
        headers: this.agregarAuthorizationHeader(),
      })
      .pipe(
        catchError((e) => {
          this.sinAutorizacion(e);
          return throwError(e);
        })
      );
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
