import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../login/usuario.service';
import { Sidebar } from './sidebar';
import { SidebarService } from './sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  indice!: Sidebar[];
  id: any;
  constructor(private apiService: SidebarService, private _router: Router, public usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.apiService.getIndice().subscribe((api) => (this.indice = api));
  }

  // Convertimos el parametro de url a base 64
  base64(id: any) {
    this.id = btoa(id);
    this._router.navigate(['/indice_videos', this.id]);
  }
}
