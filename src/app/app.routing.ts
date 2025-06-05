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
import { ServiceComponent } from './views/modules/adm/parametrage/service/service.component';
import { HeaderMessageComponent } from './views/modules/adm/parametrage/header-message/header-message.component';
import { PartenaireFinancierComponent } from './views/modules/adm/gestion-commission-reseau-phco/partenaire-financier/partenaire-financier.component';
import { UtilisateurApiNumheritComponent } from './views/modules/adm/parametrage/utilisateur-api-numherit/utilisateur-api-numherit.component';
import { BeneficiareComponent } from './views/modules/gestion-compte/beneficiare/beneficiare.component';
import { ChercherCompteComponent } from './views/modules/gestion-compte/operation-compte/chercher-compte/chercher-compte.component';
import { ActiverCompteComponent } from './views/modules/gestion-compte/operation-compte/activer-compte/activer-compte.component';
import { DesactiverCompteComponent } from './views/modules/gestion-compte/operation-compte/desactiver-compte/desactiver-compte.component';
import { SoldeCompteComponent } from './views/modules/gestion-compte/operation-compte/solde-compte/solde-compte.component';
import { CreationCompteComponent } from './views/modules/gestion-compte/creation-compte/creation-compte.component';
import { ReleveCompteComponent } from './views/modules/gestion-compte/operation-compte/releve-compte/releve-compte.component';
import { TransactionJourComponent } from './views/modules/reporting/suivi-transaction/transaction-jour/transaction-jour.component';
import { RechargementEspeceComponent } from './views/modules/gestion-compte/operation-compte/rechargement-espece/rechargement-espece.component';
import { HistoriqueTransactionComponent } from './views/modules/reporting/suivi-transaction/historique-transaction/historique-transaction.component';
import { RetraitEspeceComponent } from './views/modules/gestion-compte/operation-compte/retrait-espece/retrait-espece.component';
import { TransactionServiceComponent } from './views/modules/reporting/suivi-transaction/transaction-service/transaction-service.component';
import { TransactionAgentComponent } from './views/modules/reporting/suivi-transaction/transaction-agent/transaction-agent.component';

const routes: Routes =[
  
  { path: 'login', component: LoginComponent }, 
  { path: '',redirectTo: 'login',pathMatch: 'full'}, 
  { path: 'home', component: HomeComponent ,pathMatch: 'full'}, 
  { path: 'my-profil', component: ProfilComponent,data: { breadcrumb: 'profil.my_profile' } }, 
  { path: 'app-module/:module', component: WelcomeModuleComponent},
  
  //Module Administration : ADM
  {path : 'parametrage',data: { breadcrumb: 'module.title_module_breadcrumb'  },children : [
    {path : 'module',component: ModuleComponent,data: { breadcrumb: 'module.title_breadcrumb' }},
    {path : 'sousmodule',component: SousModuleComponent,data: { breadcrumb: 'sous_module.title_breadcrumb' }},
    {path : 'profil',component: ProfilsComponent,data: { breadcrumb: 'profil.title_breadcrumb' }},
    {path : 'type_bureau',component: TypeBureauxComponent,data: { breadcrumb: 'type_bureau.title_breadcrumb' }},
    {path : 'type_profil',component: TypeProfilComponent,data: { breadcrumb: 'type_profil.title_breadcrumb' }},
    {path : 'user',component: UtilisateurComponent,data: { breadcrumb: 'utilisateur.title_breadcrumb' }},
    {path : 'action',component: ActionComponent,data: { breadcrumb: 'action.title_breadcrumb' }},
    {path : 'service',component: ServiceComponent,data: { breadcrumb: 'service.title_breadcrumb'}},
    {path : 'header_message',component : HeaderMessageComponent, data: { breadcrumb: 'header_message.title_breadcrumb' }},
    {path : 'user_api_numherit',component: UtilisateurApiNumheritComponent,data: { breadcrumb: 'utilisateur.title_breadcrumb_api_numherit'  }},

    // {path: '**', component: PageNotFoundComponent, data: { is404: true } }
  ]}, 
  {path : 'gestion_bureau',data: { breadcrumb: 'bureau.title' },children : [
    {path : 'bureaux',component: BureauComponent,data: { breadcrumb: 'bureau.lister_bureau' }},
    {path : 'demande_credit',component: DemandeCreditComponent,data: { breadcrumb: 'demande_credit.historique_rechargement_bureau' }},
    {path : 'releve_solde_bureau',component: ReleveSoldeBureauComponent,data: { breadcrumb: 'releve_solde_bureau.title' }},
    {path : 'solde_bureau',component: SoldeBureauComponent,data: { breadcrumb: 'solde_bureau.title' }},
    {path : 'demande_rapatriement',component: DemandeRapatriementComponent,data: { breadcrumb: 'demande_rapatriement.title' }},
    {path : 'solde_des_distributeur',component: SoldeDistributeurComponent,data: { breadcrumb: 'solde_distributeur.title' }},
  ]}, 
  {path : 'gestion_compte_principal',data: { breadcrumb: 'virement.title_sous_module' },children : [
    {path : 'suivi_compte',component: SuiviComptePrincipalComponent,data: { breadcrumb: 'suivi_compte.title' }},
    {path : 'virement',component: HistoriqueVirementsComponent,data: { breadcrumb: 'virement.title' }},
    {path : 'suivi_compte_commission',component: SuiviCompteCommissionComponent,data: { breadcrumb: 'suivi_commission.title' }},
  ]}, 
  {path : 'gestion_commission_reseau_phco',data: { breadcrumb: 'partenaire.title_sous_module' },children : [
    {path : 'partenaire_financier',component: PartenaireFinancierComponent,data: { breadcrumb: 'partenaire.title' }},
  ]
  }, 
  
  //MODULE Gestion de comptes
  {
    path: 'gestion_compte', data: { breadcrumb: 'gestion_des_comptes.title_module' }, children: [
      { path: 'beneficiaire', component: BeneficiareComponent, data: { breadcrumb: 'beneficiaire.title_beneficiaire' } },
      {path : 'creer_compte',component: CreationCompteComponent,data: { breadcrumb: 'beneficiaire.creer_compte' }}
  ]},
  {
    path: 'operation_compte', data: { breadcrumb: 'operation_compte.title_breadcrumb' }, children: [
      {path : 'find_compte',component: ChercherCompteComponent,data: { breadcrumb: 'operation_compte.title_search_breadcrumb' }},
      {path : 'activer_compte',component: ActiverCompteComponent,data: { breadcrumb: 'operation_compte.title_activate_breadcrumb' }},
      {path : 'desactiver_compte',component: DesactiverCompteComponent,data: { breadcrumb: 'operation_compte.title_desactivate_breadcrumb' }},
      {path : 'solde_compte',component: SoldeCompteComponent,data :{ breadcrumb: 'operation_compte.title_solde_breadcrumb' }},
      {path : 'rechargement_espece',component: RechargementEspeceComponent,data :{ breadcrumb: 'operation_compte.title_rechargement_espece_breadcrumb' }},
      {path : 'retrait_espece',component: RetraitEspeceComponent,data :{ breadcrumb: 'operation_compte.title_retrait_espece_breadcrumb' }},
      {path : 'releve_compte',component: ReleveCompteComponent,data :{ breadcrumb: 'operation_compte.title_releve_compte_breadcrumb' }},
    ]
  },
    
  //MODULE REPORTING
  {
    path: 'reporting', data: { breadcrumb: 'reporting.title_module' }, children: [
      { path: 'transaction_du_jour', component: TransactionJourComponent, data: { breadcrumb: 'transaction_jour.title' } },
      { path: 'historique_transaction', component: HistoriqueTransactionComponent, data: { breadcrumb: 'historique_transaction.title' } },
      { path: 'transaction_par_service', component: TransactionServiceComponent, data: { breadcrumb: 'transaction_service.title' } },
      { path: 'transaction_par_agent', component: TransactionAgentComponent, data: { breadcrumb: 'transaction_agent.title' } },
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
