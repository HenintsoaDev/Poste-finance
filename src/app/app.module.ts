import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
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
import { DataTablesModule } from "angular-datatables";
import { DatePipe } from '@angular/common';
import { ProfilComponent } from './views/profil/profil.component';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatIconModule } from '@angular/material/icon';
//import { SousModuleComponent } from './sous-module/sous-module.component';
import { MonetiqueComponent } from './views/modules/monetique/monetique.component';
import { RechargeEspeceComponent } from './views/modules/monetique/recharge-espece/recharge-espece.component';
import { ToastrModule } from 'ngx-toastr';
import { ModuleComponent } from './views/modules/adm/module/module.component';
import { TableComponent } from './services/table/table.component';
import { WelcomeModuleComponent } from './views/welcome-module/welcome-module.component';
import { AuthInterceptor } from './services/auth.interceptor';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TableShimmerComponent } from './shared/table-shimmer/table-shimmer.component';

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
    MatAutocompleteModule,
    OverlayModule,
    MatMenuModule,
    MatDialogModule,
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
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' }, 
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
