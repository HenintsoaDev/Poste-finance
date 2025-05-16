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
import { ModuleComponent } from './views/modules/adm/parametrage/module/module.component';
import { SousModuleComponent } from './views/modules/adm/parametrage/sous-module/sous-module.component';
import { TypeBureauxComponent } from './views/modules/adm/parametrage/type-bureaux/type-bureaux.component';
import { TypeProfilComponent } from './views/modules/adm/parametrage/type-profil/type-profil.component';
import { PageNotFoundComponent } from './views/page-not-found/page-not-found.component';
import { ProfilsComponent } from './views/modules/adm/parametrage/profils/profils.component';
import { UtilisateurComponent } from './views/modules/adm/parametrage/utilisateur/utilisateur.component';
import { BureauComponent } from './views/modules/adm/gestion-bureau/bureau/bureau.component';
import { ActionComponent } from './views/modules/adm/parametrage/action/action.component';
import { SuiviComptePrincipalComponent } from './views/modules/adm/gestion-compte-principal/suivi-compte-principal/suivi-compte-principal.component';
import { HistoriqueVirementsComponent } from './views/modules/adm/gestion-compte-principal/historique-virements/historique-virements.component';
import { DemandeCreditComponent } from './views/modules/adm/gestion-bureau/demande-credit/demande-credit.component';
import { ReleveSoldeBureauComponent } from './views/modules/adm/gestion-bureau/releve-solde-bureau/releve-solde-bureau.component';
import { SoldeBureauComponent } from './views/modules/adm/gestion-bureau/solde-bureau/solde-bureau.component';
import { DemandeRapatriementComponent } from './views/modules/adm/gestion-bureau/demande-rapatriement/demande-rapatriement.component';
import { SoldeDistributeurComponent } from './views/modules/adm/gestion-bureau/solde-distributeur/solde-distributeur.component';
import { SuiviCompteCommissionComponent } from './views/modules/adm/gestion-compte-principal/suivi-compte-commission/suivi-compte-commission.component';
import { HeaderMessageComponent } from './views/modules/adm/parametrage/header-message/header-message.component';

const routes: Routes =[
  
  { path: 'login', component: LoginComponent }, 
  { path: '',redirectTo: 'login',pathMatch: 'full'}, 
  { path: 'home', component: HomeComponent ,pathMatch: 'full'}, 
  { path: 'my-profil', component: ProfilComponent,data: { breadcrumb: 'Mon profil' } }, 
  { path: 'app-module/:module', component: WelcomeModuleComponent},
  
  //Module Administration : ADM
  {path : 'parametrage',data: { breadcrumb: 'Parametrage & configuration' },children : [
    {path : 'module',component: ModuleComponent,data: { breadcrumb: 'Lister les modules' }},
    {path : 'sousmodule',component: SousModuleComponent,data: { breadcrumb: 'Lister les Sous module' }},
    {path : 'profil',component: ProfilsComponent,data: { breadcrumb: 'Lister les profils' }},
    {path : 'type_bureau',component: TypeBureauxComponent,data: { breadcrumb: 'Lister les types de bureaux' }},
    {path : 'type_profil',component: TypeProfilComponent,data: { breadcrumb: 'Lister les types de profil' }},
    {path : 'user',component: UtilisateurComponent,data: { breadcrumb: 'Lister les utilisateurs' }},
    {path : 'action',component: ActionComponent,data: { breadcrumb: 'Lister les actions' }},
    {path : 'header_message',component : HeaderMessageComponent, data: { breadcrumb: 'Message d\'en-tête' }},
    {path: '**', component: PageNotFoundComponent, data: { is404: true } }
  ]}, 
  {path : 'gestion_bureau',data: { breadcrumb: 'Gestion bureaux' },children : [
    {path : 'bureaux',component: BureauComponent,data: { breadcrumb: 'Lister les bureaux' }},
    {path : 'demande_credit',component: DemandeCreditComponent,data: { breadcrumb: 'Historique rechargements bureaux' }},
    {path : 'releve_solde_bureau',component: ReleveSoldeBureauComponent,data: { breadcrumb: 'Relevé solde bureau' }},
    {path : 'solde_bureau',component: SoldeBureauComponent,data: { breadcrumb: 'Solde des bureaux' }},
    {path : 'demande_rapatriement',component: DemandeRapatriementComponent,data: { breadcrumb: 'Historique rapatriement bureaux' }},
    {path : 'solde_des_distributeur',component: SoldeDistributeurComponent,data: { breadcrumb: 'Solde des distributeurs' }},
  ]}, 
  {path : 'gestion_compte_principal',data: { breadcrumb: 'Gestion compte principal' },children : [
    {path : 'suivi_compte',component: SuiviComptePrincipalComponent,data: { breadcrumb: 'Suivi compte principal' }},
    {path : 'virement',component: HistoriqueVirementsComponent,data: { breadcrumb: 'Historique des virements' }},
    {path : 'suivi_compte_commission',component: SuiviCompteCommissionComponent,data: { breadcrumb: 'Suivi compte commission' }},
  ]}, 
  
  { path: '**', component: PageNotFoundComponent, data: { is404: true } }
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
