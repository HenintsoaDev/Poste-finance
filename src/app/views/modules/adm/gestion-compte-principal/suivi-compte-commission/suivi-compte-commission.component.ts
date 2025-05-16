import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { PassageService } from 'app/services/table/passage.service';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Translatable } from 'shared/constants/Translatable';

@Component({
  selector: 'app-suivi-compte-commission',
  templateUrl: './suivi-compte-commission.component.html',
  styleUrls: ['./suivi-compte-commission.component.scss']
})
export class SuiviCompteCommissionComponent extends Translatable implements OnInit {

    typeCommission : any;
    typeCompte : string = "2";
    dateDebut : any;
    dateFin : any;
    endpoint : string = "";
    showTableSuivi = false;

    header = [
        {"nomColonne" : this.__('suivi_compte.date'),"colonneTable" : "date_transaction","table" : "releve_compte_commission"},
        {"nomColonne" :  this.__('suivi_compte.num_transac'),"colonneTable" : "num_transac","table" : "releve_compte_commission"},
        {"nomColonne" :  this.__('suivi_compte.solde_avant'),"colonneTable" : "solde_avant","table" : "releve_compte_commission"},
        {"nomColonne" :  this.__('suivi_compte.montant') + '(' + this.__('global.currency') + ')',"colonneTable" : "montant","table" : "releve_compte_commission"},
        {"nomColonne" :  this.__('suivi_compte.solde_apres'),"colonneTable" : "solde_apres","table" : "releve_compte_commission"},
        {"nomColonne" :  this.__('suivi_compte.operation'),"colonneTable" : "operation","table" : "releve_compte_commission"},
        {"nomColonne" :  this.__('suivi_compte.coms'),"colonneTable" : "commentaire","table" : "releve_compte_commission"},
        {"nomColonne" :  this.__('suivi_compte.type_compte'),"colonneTable" : "wallet_carte","table" : "releve_compte_commission"}
    ];

    
    objetBody = [
        {'name' : 'date_transaction','type' : 'text',},
        {'name' : 'num_transac','type' : 'text',},
        {'name' : 'solde_avant','type' : 'montant',},
        {'name' : 'montant','type' : 'text',},
        {'name' : 'solde_apres','type' : 'montant',},
        {'name' : 'operation','type' : 'text',},
        {'name' : 'commentaire','type' : 'text',},
        {'name' : 'wallet_carte','type' : 'text',}
    ];

    listIcon = [];
    searchGlobal = [
        'releve_compte_commission.date_transaction',
        'releve_compte_commission.num_transac',  
        'releve_compte_commission.operation', 
        'releve_compte_commission.commentaire',
        'releve_compte_commission.wallet_carte'
    ]; 

    soldeCarteParametrable: string;
    soldeWalletCarteParametrable: string;

    constructor(
        private passageService: PassageService,
        private toastr: ToastrService,
        private datePipe: DatePipe, 
        private authService: AuthService
    ) {
        super();
    }

    async  ngOnInit() {
        this.endpoint = environment.baseUrl + '/' + environment.suivi_compte_commission; 
    }

    afficheSolde(){
        let soldeCarteParametrable = localStorage.getItem(environment.soldeCarteParametrable);
        let soldeWalletParametrable = localStorage.getItem(environment.soldeWalletCarteParametrable);
  
        this.soldeCarteParametrable = (soldeCarteParametrable) ? soldeCarteParametrable : undefined;
        this.soldeWalletCarteParametrable = (soldeWalletParametrable) ? soldeWalletParametrable : undefined;
    }

    searchSuiviDefault()
    {
        let type_commission = "&type_service="+this.typeCommission;
        let filtreParMulti =  type_commission + "&__order__=desc,date_transaction";
        this.typeCompte = "2";
        this.dateDebut = undefined;
        this.dateFin = undefined;
        this.passageService.appelURL(filtreParMulti);
        setTimeout(()=>{
            this.afficheSolde();
        },2000)
        
        this.showTableSuivi = true;
    }

    filtreTableau()
    {
        let type_commission = "&type_service="+this.typeCommission;
        let filtre_search = "" ;
        if(this.typeCompte != '2'){
            filtre_search = ",releve_compte_commission.wallet_carte|e|"+this.typeCompte;
        }

        let date_debut = this.datePipe.transform(this.dateDebut, 'yyyy-MM-dd');
        let dateFin = this.datePipe.transform(this.dateFin, 'yyyy-MM-dd');
      
        let filtreDate = "" ;
        if(this.dateDebut && this.dateFin){
            if( this.dateDebut > this.dateFin ){
              this.toastr.warning(this.__('msg.dateDebut_dateFin_error'),this.__("msg.warning"));
              return;
            }else{
              filtreDate = "&date_debut="+date_debut +"&date_fin="+dateFin;
            }
        }
        
        let filtreParMulti =  filtre_search + filtreDate + "&__order__=desc,date_transaction" + type_commission;
        this.passageService.appelURL(filtreParMulti);
    }

    backSelectCommission()
    {
        this.showTableSuivi = false;
    }

}
