import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UsuarioService } from '../login/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
private urlEnpoint='http://localhost:8080/api/actualizarPass';
private httpHeaders = new HttpHeaders({'Content-Type' : 'application/json'});
  constructor(private http: HttpClient, private usuarioService: UsuarioService, private router: Router) { }
  // funcion para validar que se haya iniciado sesion
  private sinAutorizacion(e): boolean{
    if( e.status === 401 || e.status === 403 ){
      this.router.navigate(['/login']);
      return true;
    }
    return false;
  }

  actualizarContraseña(passw:string): Observable<any> {
    let formData = new FormData();
    // tslint:disable-next-line:quotemark
    formData.append("correo", this.usuarioService.usuario.correo + "");
    formData.append("pass", passw);
   console.log("entra servi header");
    return this.http.post<any>(`${this.urlEnpoint}`, formData).pipe(
             catchError(
            e => {
              this.sinAutorizacion(e);
              return throwError(e);
    
            }
          )
        );
      }
}
