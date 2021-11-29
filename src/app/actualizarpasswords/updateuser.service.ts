import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UsuarioService } from '../login/usuario.service';
import { Usuario } from './usuario';

@Injectable({
  providedIn: 'root'
})
export class UpdateuserService {

  private httpHeaders = new HttpHeaders({'Content-Type' : 'application/json'});

  private EndPointUser='http://localhost:8080/api/actualizarPass';
  private EndPointUse2r='http://localhost:8080/api/usuarios';
  
  constructor(private router: Router, private http: HttpClient, private usuarioService: UsuarioService) { }

  actualizarPass(correo, password): void{



this.http.post<any>(this.EndPointUser, "");

  }

actualizarPassword(correo : string, password : string) : Observable<any>  {

    var formData = new FormData();
    formData.append("correo", correo);
    formData.append("password", password);

    return this.http.post<any>(`${this.EndPointUser}`,formData).pipe(
      
      catchError(e => {
        
        this.sinAutorizacion(e);
        return throwError(e);

    }));


}

   
obtenerUsuariosAll():any{
  return this.http.get<any[]>(this.EndPointUse2r, { headers: this.agregarAuthorizationHeader()}).pipe(
    catchError(
      e => {
        this.sinAutorizacion(e);
        return throwError(e);
      }
    )
  );
}
  //-------------------------------------------------------------------

  

  // se ponen las cabeceras o headers para ser enviados al backend
  private agregarAuthorizationHeader(){
    let token = this.usuarioService.token;
    if(token != null){
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders;

  }
  

  // funcion para validar que se haya iniciado sesion
  private sinAutorizacion(e): boolean{
    if( e.status === 401 || e.status === 403 ){
      this.router.navigate(['/login']);
      return true;
    }
    return false;
  }

}
