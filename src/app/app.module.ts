import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginComponent } from './views/login/login.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAnchor, MatButton, MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { DataTablesModule } from "angular-datatables";
import { DatePipe, registerLocaleData } from '@angular/common';
import { ProfilComponent } from './views/profil/profil.component';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatIconModule } from '@angular/material/icon';
//import { SousModuleComponent } from './sous-module/sous-module.component';
import { MonetiqueComponent } from './views/modules/monetique/monetique.component';
import { RechargeEspeceComponent } from './views/modules/monetique/recharge-espece/recharge-espece.component';
import { ToastrModule } from 'ngx-toastr';
import { ModuleComponent } from './views/modules/adm/parametrage/module/module.component';
import { TableComponent } from './services/table/table.component';
import { WelcomeModuleComponent } from './views/welcome-module/welcome-module.component';
import { AuthInterceptor } from './services/auth.interceptor';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TableShimmerComponent } from './shared/table-shimmer/table-shimmer.component';
import { SousModuleComponent } from './views/modules/adm/parametrage/sous-module/sous-module.component';
import { TypeBureauxComponent } from './views/modules/adm/parametrage/type-bureaux/type-bureaux.component';
import { TypeProfilComponent } from './views/modules/adm/parametrage/type-profil/type-profil.component';
import { ProfilsComponent } from './views/modules/adm/parametrage/profils/profils.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { UtilisateurComponent } from './views/modules/adm/parametrage/utilisateur/utilisateur.component';
import localeFr from '@angular/common/locales/fr';
import { PageNotFoundComponent } from './views/page-not-found/page-not-found.component';
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
import { CreationCompteComponent } from './views/modules/gestion-compte/creation-compte/creation-compte.component';


registerLocaleData(localeFr);
@NgModule({
  exports:[
    TableComponent,
    TableShimmerComponent
  ],
  
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatTabsModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    OverlayModule,
    MatMenuModule,
    MatDialogModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxIntlTelInputModule,
    DataTablesModule,
    Ng2TelInputModule,
    ModalModule.forRoot(),
    ToastrModule.forRoot() // configuration globale
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    LoginComponent,
    //SousModuleComponent,
    MonetiqueComponent,
    RechargeEspeceComponent,
    ModuleComponent,
    TableComponent,
    WelcomeModuleComponent,
    TableShimmerComponent,
    SousModuleComponent,
    TypeBureauxComponent,
    TypeProfilComponent,
    PageNotFoundComponent,
    ProfilsComponent,
    UtilisateurComponent,
    BureauComponent,
    ActionComponent,
    SuiviComptePrincipalComponent,
    HistoriqueVirementsComponent,
    ReleveSoldeBureauComponent,
    SoldeBureauComponent,
    DemandeCreditComponent,
    DemandeRapatriementComponent,
    SoldeDistributeurComponent,
    SuiviCompteCommissionComponent,
    ServiceComponent,
    HeaderMessageComponent,
    PartenaireFinancierComponent,
    UtilisateurApiNumheritComponent,
    BeneficiareComponent,
    ChercherCompteComponent,
    ActiverCompteComponent,
    DesactiverCompteComponent,
    CreationCompteComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' }, 
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
