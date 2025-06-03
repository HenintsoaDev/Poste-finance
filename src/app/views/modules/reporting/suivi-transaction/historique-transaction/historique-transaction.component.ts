import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { AuthService } from 'app/services/auth.service';
import { PassageService } from 'app/services/table/passage.service';
import { environment } from 'environments/environment';
import { CountryISO,SearchCountryField } from 'ngx-intl-tel-input';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Translatable } from 'shared/constants/Translatable';

@Component({
  selector: 'app-historique-transaction',
  templateUrl: './historique-transaction.component.html',
  styleUrls: ['./historique-transaction.component.scss']
})
export class HistoriqueTransactionComponent extends Translatable implements OnInit {

    endpoint = "";
    header = [
        { "nomColonne": this.__('global.date'), "colonneTable": "date_transaction", "table": "transaction" },
        {"nomColonne" :  this.__('global.num_transac'),"colonneTable" : "num_transac","table" : "transaction"},
        {"nomColonne" :  this.__('global.nom_client'),"colonneTable" : "client","table" : "transaction"},
        //{"nomColonne" :  this.__('utilisateur.telephone'),"colonneTable" : "telephone","table" : "transaction"},
        {"nomColonne" : this.__('global.service'), "colonneTable": "service", "table": "transaction" },
        {"nomColonne" :  this.__('global.montant'),"colonneTable" : "montant","table" : "transaction"},
        {"nomColonne" :  this.__('service.frais'),"colonneTable" : "commission","table" : "transaction"},
        { "nomColonne": this.__('global.montant_brut'), "colonneTable": "montant_ttc", "table": "transaction" },
        {"nomColonne" :  this.__('global.effectue_par'),"colonneTable" : "effectue_par","table" : "transaction"},
        {"nomColonne" :  this.__('global.agence'),"colonneTable" : "agence","table" : "transaction"},
        {"nomColonne" :  this.__('suivi_compte.type_compte'),"colonneTable" : "wallet_carte","table" : "transaction"},
        {"nomColonne" : this.__('global.action')}
    ]
    
    objetBody = [
        {'name' : 'date_transaction', 'type': 'text', },
        {'name' : 'num_transac','type' : 'text',},
        { 'name': 'client', 'type': 'text', },
        //{'name' : 'telephone','type' : 'text',},
        {'name' : 'service','type' : 'text',},
        { 'name': 'montant', 'type': 'montant', },
        {'name' : 'commission','type' : 'montant',},
        {'name' : 'montant_ttc','type' : 'montant',},
        { 'name': 'effectue_par', 'type': 'text', },
        {'name' : 'agence','type' : 'text',},
        {'name' : 'wallet_carte','type' : 'text',},
        {'name' : 'id',},
    ]
    
    listIcon = [{'icon' : 'info','action' : 'info','tooltip' : this.__('global.tooltip_detail'),'autority' : '',},]
    searchGlobal = ['transaction.num_transac']

    titleModal: string;
    num_compte: any;
    type_recherche: any;
    telephone: any;
    typeCompte: string = "2";
    dateDebut: string = new Date().toISOString().substring(0, 10);
    dateFin: string = new Date().toISOString().substring(0, 10);

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
    subscription: Subscription;

    constructor(
        private toastr: ToastrService, 
        private passageService: PassageService,
        private datePipe: DatePipe, 
        private authService : AuthService
    ) {
        super();
    }

    ngOnInit(): void {

        this.authService.initAutority("SUT","REP");

        this.passageService.clear();
        /***************************************** */
        // Écouter les changements de modal à travers le service si il y a des actions
        this.subscription = this.passageService.getObservable().subscribe(event => {
            if( event.data){
                // Nettoyage immédiat de l'event
                this.passageService.clear();  // ==> à implémenter dans ton service
            }
        });
        this.endpoint = environment.baseUrl + '/' + environment.reporting_historique_transaction;
        /***************************************** */



    }

    ngOnDestroy() {
        if (this.subscription) {
          this.subscription.unsubscribe();
        }
    }

    filtreTableau()
    {
        this.listShow = true;
        
        let type = null;
        if(this.type_recherche == "N") type = 1;
        else if(this.type_recherche == "T") type = 0;

        let filtre_type_recherche = '';
        if(this.type_recherche != undefined) filtre_type_recherche = "&type_recherche="+type;
        
        let filtre_wallet_carte = '';
        if(this.typeCompte != "2") filtre_wallet_carte = "&wallet_carte="+this.typeCompte;
        
        let filtre_telephone = '';
        if(this.telephone != undefined) {
            let telephone = this.telephone.replace('+', "00");
            filtre_telephone = "&telephone="+telephone;
        }
        
        let filtre_numcompte = '';
        if(this.num_compte != undefined) filtre_numcompte = "&num_compte="+this.num_compte;
        
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

    videForm(){
        this.type_recherche = undefined;
        this.num_compte = "";
        this.telephone = "";
        this.typeCompte = "";
    }

    fermerPannel() {
        this.panel.close();
    }

    /** PHONE NUMBER */
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
