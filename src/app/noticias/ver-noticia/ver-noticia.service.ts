import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Noticias } from '../noticias';
import { catchError, map } from 'rxjs/operators';
import { UsuarioService } from 'src/app/login/usuario.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class VerNoticiaService {
  arrayNotice: any = [];
  private urlEndPoint: string = 'http://localhost:8080/api/noticias';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private usuarioService: UsuarioService, private router: Router) {}

  getIndice(id: any): Observable<Noticias[]> {
    this.arrayNotice = [];
    return this.http.get<Noticias[]>(`${this.urlEndPoint}/${id}`).pipe(
      map((response) => {
        let data = response as Noticias[];
          this.arrayNotice.push(data);
        return this.arrayNotice;
      })
    );
  }

  getNotice(): Observable<Noticias[]> {
    return this.http
      .get(this.urlEndPoint)
      .pipe(map((response) => response as Noticias[]));
  }

  delete(id: number): Observable<Noticias> {
    return this.http.delete<Noticias>(`${this.urlEndPoint}/${id}`, {
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
