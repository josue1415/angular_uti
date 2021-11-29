import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Foro } from './foro';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { UsuarioService } from '../login/usuario.service';import { Router } from '@angular/router';
;

@Injectable({
  providedIn: 'root',
})
export class ForoService {
  private urlEndPoint: string = 'http://localhost:8080/api/foros';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(
    private http: HttpClient,
    public usuarioService: UsuarioService,
    private router: Router
  ) {}

  getForos(): Observable<Foro[]> {
    return this.http.get<Foro[]>(this.urlEndPoint);
  }
 
  delete(id: number): Observable<Foro> {
    return this.http
      .delete<Foro>(`${this.urlEndPoint}/${id}`, {
        headers: this.agregarAuthorizationHeader(),
      })
      .pipe(
        catchError((err) => {
          Swal.fire(
            '¡FORO NO ELIMINADO!',
            'El foro está activo, asegúrese que este no contenga respuestas.',
            'error'
          );
          this.sinAutorizacion(err);
          return throwError(err);
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
