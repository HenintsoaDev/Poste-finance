import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginComponent } from './views/login/login.component';
import { HomeComponent } from './views/home/home.component';
//import { AdministrationComponent } from './administration/administration.component';
import { ProfilComponent } from './views/profil/profil.component';
import { MonetiqueComponent } from './views/modules/monetique/monetique.component';
import { RechargeEspeceComponent } from './views/modules/monetique/recharge-espece/recharge-espece.component';
import { WelcomeModuleComponent } from './views/welcome-module/welcome-module.component';
import { ModuleComponent } from './views/modules/adm/module/module.component';
import { SousModuleComponent } from './views/modules/adm/sous-module/sous-module.component';

const routes: Routes =[
  
  { path: 'login', component: LoginComponent }, 
  { path: '',redirectTo: 'login',pathMatch: 'full'}, 
  { path: 'home', component: HomeComponent ,pathMatch: 'full'}, 
  { path: 'my-profil', component: ProfilComponent,data: { breadcrumb: 'Mon profil' } }, 
  { path: 'app-module/:module', component: WelcomeModuleComponent},
  { path: ':module',data: { breadcrumb: 'Administration' }, children:[
    {path : 'parametrage',data: { breadcrumb: 'Parametrage & configuration' },children : [
      {path : 'module',component: ModuleComponent,data: { breadcrumb: 'Lister les modules' }},
      {path : 'sousmodule',component: SousModuleComponent,data: { breadcrumb: 'Lister les Sous module' }},

    ]},
  ]}, 
  /*{
    path: '',
    component: AdminLayoutComponent,
    children: [{
      path: '',
      loadChildren: () => import('./layouts/admin-layout/admin-layout.module').then(m => m.AdminLayoutModule)
    }]
  }*/
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
