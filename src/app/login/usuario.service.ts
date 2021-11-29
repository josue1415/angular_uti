import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from './usuario';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  // tslint:disable-next-line:variable-name
  private _usuario!: Usuario;
  // tslint:disable-next-line:variable-name
  private _token: any;

  constructor(private http: HttpClient) {}

  public get usuario(): Usuario {
    if (this._usuario != null) {
      return this._usuario;
    } else if (
      this._usuario == null &&
      sessionStorage.getItem('usuario') != null
    ) {
      // tslint:disable-next-line:no-unused-expression
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')!) as Usuario;
      return this._usuario;
    }
    return new Usuario();
  }
  public get token(): string {
    if (this._token != null) {
      return this._token;
    } else if (this._token == null && sessionStorage.getItem('token') != null) {
      // tslint:disable-next-line:no-unused-expression
      this._token = sessionStorage.getItem('usuario');
      return this._token;
    }
    // tslint:disable-next-line:align
    return "";
  }

  login(usuario: Usuario): Observable<any> {
    const urlEndPoint = 'http://localhost:8080/oauth/token';

    const credenciales = btoa('bibliotecaApp' + ':' + '123456');

    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      // tslint:disable-next-line:object-literal-key-quotes
      Authorization: 'Basic ' + credenciales,
    });

    // tslint:disable-next-line:prefer-const
    let params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', usuario.correo);
    params.set('password', usuario.password);

    return this.http.post<any>(urlEndPoint, params.toString(), {
      headers: httpHeaders,
    });
  }

  guardarUsuario(accessToken: string): void {
    let payload = this.obtenerDatosToken(accessToken);

    this._usuario = new Usuario();
    this._usuario.nombre = payload.nombre_usuario;
    this._usuario.correo = payload.user_name;
    this._usuario.id = payload.usuario_id;
    this._usuario.roles = payload.authorities;
    sessionStorage.setItem('usuario', JSON.stringify(this._usuario));
  }

  guardarToken(accessToken: string): void {
    this._token = accessToken;
    sessionStorage.setItem('token', this._token);
  }

  
  obtenerDatosToken(accessToken: string): any {
    if (accessToken.length>700) {
      //console.log(accessToken.length);
      //return ((accessToken.split('.')[1]));
      return JSON.parse(atob(accessToken.split('.')[1]));
    }else{
      //console.log(accessToken.length);
      return null;
    }
  }

  estaAutenticado(): boolean {
    let payload = this.obtenerDatosToken(this.token);
    if (payload != null && payload.user_name && payload.user_name.length > 0) {
      return true;
    }
    return false;
  }

  obtenerRol(): boolean {
    let payload = this.obtenerDatosToken(this.token);
    // tslint:disable-next-line:triple-equals
    if (this._usuario.roles[0] == 'ROLE_LMSADMIN') {
      return true;
    }
    return false;
  }

  obtenerRolRoot(): boolean{
    let payload = this.obtenerDatosToken(this.token);
    // tslint:disable-next-line:triple-equals
    if(this._usuario.roles[0] == 'ROLE_LMSADMIN'){
      return true;
    }
    return false;
  }
  
  logout(): void {
    this._token = null;
    this._usuario = new Usuario;
    sessionStorage.clear();
  }
}
