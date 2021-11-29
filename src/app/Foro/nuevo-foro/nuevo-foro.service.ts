import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { Foro } from '../foro';

@Injectable({
  providedIn: 'root',
})
export class NuevoForoService {
  private urlEndPoint: string = 'http://localhost:8080/api/foros';
  private urlEndPointMail: string = 'http://localhost:8080/notification/foro';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(
    private http: HttpClient,
  ) {}

  create(resp: Foro): Observable<Foro> {
    return this.http.post<Foro>(this.urlEndPoint, resp);
  }

  sendMail(tema: string, emisor: string): Observable<Foro> {
    return this.http.get<Foro>(`${this.urlEndPointMail}/${tema}/${emisor}`);
  }

}
