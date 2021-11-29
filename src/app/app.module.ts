import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { ForoComponent } from './Foro/foro.component';
import { ForoService } from './Foro/foro.service';
import { RouterModule, Routes } from '@angular/router';
import { RespuestasComponent } from './Foro/respuestas/respuestas.component';
import { NuevoForoComponent } from './Foro/nuevo-foro/nuevo-foro.component';
import { NoticiasComponent } from './noticias/noticias.component';
import { NuevaNoticiaComponent } from './noticias/nueva-noticia/nueva-noticia.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ContenidoComponent } from './videos/contenido/contenido.component';
import { VerNoticiaComponent } from './noticias/ver-noticia/ver-noticia.component';
import { VideosComponent} from './videos/videos.component';
import { ActualizarpasswordsComponent} from './actualizarpasswords/actualizarpasswords.component';

import { DataTablesModule } from "angular-datatables";

//Scroll reveal effect
import {NgsRevealModule} from 'ngx-scrollreveal';

// Quill use to insert html from input text
import { QuillModule } from 'ngx-quill';
// Pipe to Sanatize URL's, HTML, etc.
import { KeysPipePipe } from './keys-pipe.pipe';
// Paginación
import { NgxPaginationModule } from 'ngx-pagination';
// forms angular
import { FormsModule } from '@angular/forms';
import { FormComponent } from './videos/form/form.component';
//login import
import { LoginComponent } from './login/login.component';
import { VigenciaComponent } from './noticias/vigencia/vigencia.component';
import { AdminComponent } from './noticias/permisos/admin/admin.component';

const routes: Routes = [
  { path: '', redirectTo: '/noticias', pathMatch: 'full' },
  { path: 'foros/:page', component: ForoComponent },
  { path: 'foros', component: ForoComponent },
  { path: 'foros_respuestas/:id/:page', component: RespuestasComponent },
  { path: 'agg_foro', component: NuevoForoComponent },
  { path: 'noticias', component: NoticiasComponent },
  { path: 'noticias/:page', component: NoticiasComponent },
  { path: 'aggNotice', component: NuevaNoticiaComponent },
  { path: 'aggNotice/:id', component: NuevaNoticiaComponent },
  { path: 'indice_videos/:id', component: ContenidoComponent },
  { path: 'noticia/:id/:page', component: VerNoticiaComponent },
  { path: 'addvideo/:id/:id2', component: FormComponent },
  { path: 'addvideo/:id', component: FormComponent },
  { path: 'login', component: LoginComponent },
  { path: 'vigencia', component: VigenciaComponent },
  { path: 'updatepassword', component: ActualizarpasswordsComponent },
  { path: '**', redirectTo: '/noticias' },
];

@NgModule({
  declarations: [
    AppComponent,
    ForoComponent,
    RespuestasComponent,
    NuevoForoComponent,
    NoticiasComponent,
    NuevaNoticiaComponent,
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    ContenidoComponent,
    KeysPipePipe,
    VerNoticiaComponent,
    FormComponent,
    LoginComponent,
    VideosComponent,
    VigenciaComponent,
    AdminComponent,
    ActualizarpasswordsComponent
  ],
  imports: [
    BrowserModule,
    DataTablesModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    QuillModule.forRoot(),
    NgxPaginationModule,
    FormsModule,
    NgsRevealModule,
  ],
  // providers: [ForoService, { provide: LocationStrategy, useClass: HashLocationStrategy }],
  providers: [ForoService],

  bootstrap: [AppComponent],
})
export class AppModule {}
