import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginComponent } from './views/login/login.component';
import { HomeComponent } from './views/home/home.component';
//import { AdministrationComponent } from './administration/administration.component';
import { DataTableComponent } from './views/modules/adm/data-table/data-table.component';
import { ProfilComponent } from './views/profil/profil.component';
import { AdmComponent } from './views/modules/adm/adm.component';
import { MonetiqueComponent } from './views/modules/monetique/monetique.component';
import { RechargeEspeceComponent } from './views/modules/monetique/recharge-espece/recharge-espece.component';
import { ModuleComponent } from './views/modules/adm/module/module.component';

const routes: Routes =[
  
  { path: 'login', component: LoginComponent }, 
  { path: '',redirectTo: 'login',pathMatch: 'full'}, 
  { path: 'home', component: HomeComponent ,pathMatch: 'full'}, 
  //{ path: 'administration', component: AdministrationComponent }, 
  { path: 'ADM', component: ModuleComponent,data: { breadcrumb: 'Administration' },children:[
    {path : 'gestion-personnel',data: { breadcrumb: 'Géstion Personnelles' },children:[
      {path : 'list-personnel',component: DataTableComponent,data: { breadcrumb: 'Liste des personnels' }},
    ]},
    {path : 'gestion-enseignant',component: DataTableComponent,data: { breadcrumb: 'Géstion Enseignants' }},
  ]}, 
  {
    path: 'MN', component: MonetiqueComponent,data: { breadcrumb: 'Monetique' }, children:[
      {path : 'rechargement-espece',data: { breadcrumb: 'Recharge par Espèce' },children : [
        {path : 'recharger',component: RechargeEspeceComponent,data: { breadcrumb: 'Recharger' }}
      ]},
    ]
  },
  { path: 'my-profil', component: ProfilComponent,data: { breadcrumb: 'Mon profil' } }, 
  {
    path: '',
    component: AdminLayoutComponent,
    children: [{
      path: '',
      loadChildren: () => import('./layouts/admin-layout/admin-layout.module').then(m => m.AdminLayoutModule)
    }]
  }
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
