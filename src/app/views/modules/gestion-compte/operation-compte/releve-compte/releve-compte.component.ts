import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
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
    dateDebut: string = new Date().toISOString().substring(0, 10);
    dateFin: string = new Date().toISOString().substring(0, 10);
    
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
  @ViewChild('panel') panel!: MatExpansionPanel;
  releve_comptes: any;
  
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

  fermerPannel() {
    this.panel.close();
  }
  videForm(){
    this.type_recherche = null;
    this.num_compte = "";
    this.telephone = "";
    this.typeCompte = "";
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
      


      let filtre_telephone = '';
      if(this.telephone != null) {
        let telephone = this.telephone.replace('+', "00");
        filtre_telephone = "&telephone="+telephone;

      }
      
      

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
      this.fermerPannel();
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



  async exportExcel() {
    const storedData = localStorage.getItem('data');
    let result : any;
    if (storedData) result = JSON.parse(storedData);

    this.releve_comptes = result.data;

    let date_debut = this.datePipe.transform(this.dateDebut, 'dd-MM-yyyy');
    let date_fin = this.datePipe.transform(this.dateFin, 'dd-MM-yyyy');

    let title = this.__("operation_compte.list_releve_compte") + ' ' ;
    title  += this.type_recherche == "T" ? this.__("operation_compte.telephone") + " " + this.telephone : this.__("operation_compte.num_compte") + " " + this.num_compte + ' '
    title  += this.__("suivi_compte.from") + ' ' + date_debut  + ' '
    title  += this.__("suivi_compte.to") + ' ' + date_fin

    this.authService.exportExcel(this.print(this.releve_comptes),title).then(
        (response: any)=>{
            console.log('respons beee',response)
                let a = document.createElement("a"); 
                a.href = response.data;
                a.download = `${title}.xlsx`;
                a.click(); 
        },
        (error:any)=>{console.log(error)}
    );
}

async exportPdf() {
    const storedData = localStorage.getItem('data');
    let result : any;
    if (storedData) result = JSON.parse(storedData);

    this.releve_comptes = result.data;
    console.log(this.releve_comptes);

    let date_debut = this.datePipe.transform(this.dateDebut, 'dd-MM-yyyy');
    let date_fin = this.datePipe.transform(this.dateFin, 'dd-MM-yyyy');

    let title = this.__("operation_compte.list_releve_compte") + ' : ' ;
    title  += this.type_recherche == "T" ? this.__("operation_compte.telephone") + " " + this.telephone : this.__("operation_compte.num_compte") + " " + this.num_compte + ' '
    title  += this.__("suivi_compte.from") + ' ' + date_debut  + ' '
    title  += this.__("suivi_compte.to") + ' ' + date_fin
    
    this.authService.exportPdf(this.print(this.releve_comptes), title ).then(
        (response: any)=>{},
        (error:any)=>{console.log(error)}
    );
}

print(releve_comptes:any[]){
    let tab = releve_comptes.map((releve_compte: any, index: number) => {
        let t: any = {};
            t[this.__('suivi_compte.date')] = releve_compte.date_transaction;
            t[this.__('suivi_compte.num_transac')] = releve_compte.num_transac;
            t[this.__('suivi_compte.solde_avant')+ ' (' + this.__('global.currency') + ')'] = releve_compte.solde_avant;
            t[this.__('suivi_compte.montant')+ ' (' + this.__('global.currency') + ')'] = releve_compte.montant;
            t[this.__('suivi_compte.solde_apres')+ ' (' + this.__('global.currency') + ')'] = releve_compte.solde_apres;
            t[this.__('suivi_compte.operation')] = releve_compte.operation;
            t[this.__('suivi_compte.coms')] = releve_compte.commentaire;

            t[this.__('suivi_compte.type_compte')] = releve_compte.wallet_carte;
        return t;
    });

    return tab;
  }

}
