import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sidebar } from './sidebar';
import { UsuarioService } from '../login/usuario.service';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private urlEndPoint: string = 'http://localhost:8080/api/indice_video';
  constructor(private http: HttpClient, public usuarioService: UsuarioService) {}

  getIndice(): Observable<Sidebar[]> {
    return this.http.get<Sidebar[]>(this.urlEndPoint);
  }
}
