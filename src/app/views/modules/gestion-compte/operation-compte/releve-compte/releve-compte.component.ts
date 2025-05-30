import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { PassageService } from 'app/services/table/passage.service';
import { environment } from 'environments/environment';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CountryISO, SearchCountryField } from 'ngx-intl-tel-input';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Translatable } from 'shared/constants/Translatable';

@Component({
  selector: 'app-releve-compte',
  templateUrl: './releve-compte.component.html',
  styleUrls: ['./releve-compte.component.scss']
})
export class ReleveCompteComponent extends Translatable implements OnInit {

  
    /***************************************** */
    endpoint = "";
    header = [
      {"nomColonne" : this.__('suivi_compte.date'),"colonneTable" : "date_transaction","table" : "releve_comptes_client"},
        {"nomColonne" :  this.__('suivi_compte.num_transac'),"colonneTable" : "num_transac","table" : "releve_comptes_client"},
        {"nomColonne" :  this.__('suivi_compte.solde_avant'),"colonneTable" : "solde_avant","table" : "releve_comptes_client", "align": "right"},
        {"nomColonne" :  this.__('suivi_compte.montant') + '(' + this.__('global.currency') + ')',"colonneTable" : "montant","table" : "releve_comptes_client", "align": "right"},
        {"nomColonne" :  this.__('suivi_compte.solde_apres'),"colonneTable" : "solde_apres","table" : "releve_comptes_client", "align": "right"},
        {"nomColonne" :  this.__('suivi_compte.operation'),"colonneTable" : "operation","table" : "releve_comptes_client"},
        {"nomColonne" :  this.__('suivi_compte.coms'),"colonneTable" : "commentaire","table" : "releve_comptes_client"},
        {"nomColonne" :  this.__('suivi_compte.type_compte'),"colonneTable" : "wallet_carte","table" : "releve_comptes_client"}
    ]
    
    objetBody = [
      {'name' : 'date_transaction','type' : 'text',},
      {'name' : 'num_transac','type' : 'text',},
      {'name' : 'solde_avant','type' : 'montant',},
      {'name' : 'montant','type' : 'montant',},
      {'name' : 'solde_apres','type' : 'montant',},
      {'name' : 'operation','type' : 'text',},
      {'name' : 'commentaire','type' : 'text',},
      {'name' : 'wallet_carte','type' : 'text',}
     ]
    
    listIcon = [
    
  
    ]
    searchGlobal = [ 'agence.code', 'agence.name','departement.name', 'agence.responsable', 'agence.adresse']
    
    titleModal: string;
    num_compte: any;
    type_recherche: any;
    telephone: any;
    typeCompte: any;
    dateDebut: string = "" //new Date().toISOString().substring(0, 10);
    dateFin: string = ""//new Date().toISOString().substring(0, 10);
    
      /***************************************** */
  
      

        /**INPUT PHONE */
  objetPhone : any;
  element : any;
  currenCode :string ="mg";
  tel!: string;
  /**INPUT PHONE */

  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.Madagascar];
  selectedCountryISO = 'mg';
  phoneNumber = '';
  dialCode: any = '261';
  listShow: boolean = false;
  
  constructor( private toastr: ToastrService, 
    private passageService: PassageService,
    private modalService: BsModalService,
    private datePipe: DatePipe, 
    private authService : AuthService) {

    super();
   }
   subscription: Subscription;

  ngOnInit(): void {


    this.authService.initAutority("GBU","ADM");

    this.titleModal = this.__('bureau.title_add_modal');

    this.passageService.clear();

     /***************************************** */
        // Écouter les changements de modal à travers le service si il y a des actions
        this.subscription = this.passageService.getObservable().subscribe(event => {

          if( event.data){

            // Nettoyage immédiat de l'event
            this.passageService.clear();  // ==> à implémenter dans ton service
      
          }
         
        
    });
        this.endpoint = environment.baseUrl + '/' + environment.releve_compte;
    /***************************************** */


  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
}
  videForm(){
    this.type_recherche = null;
    this.num_compte = "";
    this.telephone = "";
  }



  filtreTableau()
  {
     this.listShow = true;
     
      let type = null;
      if(this.type_recherche == "N") type = 1;
      else if(this.type_recherche == "T") type = 0;

      let filtre_type_recherche = '';
      if(type != null) filtre_type_recherche = "&type_recherche="+type;
      

      let filtre_wallet_carte = '';
      if(this.typeCompte != null) filtre_wallet_carte = "&wallet_carte="+this.typeCompte;
      
      let telephone = this.telephone.replace('+', "00");


      let filtre_telephone = '';
      if(this.telephone != null) filtre_telephone = "&telephone="+telephone;
      

      let filtre_numcompte = '';
      if(this.num_compte != null) filtre_numcompte = "&num_compte="+this.num_compte;
      

      let date_debut = this.datePipe.transform(this.dateDebut, 'yyyy-MM-dd');
      let date_fin = this.datePipe.transform(this.dateFin, 'yyyy-MM-dd');
    
      let filtreDate = "" ;
      if(date_debut && date_fin){
          if( date_debut > date_fin ){
            this.toastr.warning(this.__('msg.dateDebut_dateFin_error'),this.__("msg.warning"));
            return;
          }else{
            filtreDate = "&date_debut="+date_debut +"&date_fin="+date_fin;
          }
      }
      
      let filtreParMulti =  filtre_telephone  +  filtre_wallet_carte + filtre_numcompte + filtre_type_recherche + filtreDate;
      this.passageService.appelURL(filtreParMulti);
  }



  changePreferredCountries() {
    this.preferredCountries = [CountryISO.India, CountryISO.Canada];
  }


  telInputObject(m:any){
    this.objetPhone = m.s
    
  }

  onCountryChange(event: any) {
    this.dialCode = event.dialCode; // ← ici tu obtiens '261' ou '221'
    
  }

  controle(element:any){}

  hasError: boolean = false;
  onError(obj : any) {
      this.hasError = obj;
  }

  getNumber(obj : any) {
    this.telephone = obj;
  }



}
