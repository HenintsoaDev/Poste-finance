import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PassageService } from 'app/services/table/passage.service';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Translatable } from 'shared/constants/Translatable';

@Component({
  selector: 'app-suivi-compte-principal',
  templateUrl: './suivi-compte-principal.component.html',
  styleUrls: ['./suivi-compte-principal.component.scss']
})
export class SuiviComptePrincipalComponent extends Translatable implements OnInit {

    /***************************************** */
    endpoint = "";
    header = [
        {"nomColonne" : "Date","colonneTable" : "date_transaction","table" : "releve_des_comptes"},
        {"nomColonne" : "N°transaction","colonneTable" : "num_transac","table" : "releve_des_comptes"},
        {"nomColonne" : "Solde avant","colonneTable" : "solde_avant","table" : "releve_des_comptes"},
        {"nomColonne" : "Solde après","colonneTable" : "solde_apres","table" : "releve_des_comptes"},
        {"nomColonne" : "Montant (Ar)","colonneTable" : "montant","table" : "releve_des_comptes"},
        {"nomColonne" : "Opération","colonneTable" : "operation","table" : "releve_des_comptes"},
        {"nomColonne" : "Commentaire","colonneTable" : "commentaire","table" : "releve_des_comptes"},
        {"nomColonne" : "Type de cmpte","colonneTable" : "wallet_carte","table" : "releve_des_comptes"}
    ];

    objetBody = [
        {'name' : 'date_transaction','type' : 'text',},
        {'name' : 'num_transac','type' : 'text',},
        {'name' : 'solde_avant','type' : 'text',},
        {'name' : 'solde_apres','type' : 'text',},
        {'name' : 'montant','type' : 'text',},
        {'name' : 'operation','type' : 'text',},
        {'name' : 'commentaire','type' : 'text',},
        {'name' : 'wallet_carte','type' : 'text',}
    ]

    listIcon = [];
    searchGlobal = [ 'releve_des_comptes.date_transaction', 'releve_des_comptes.operation', 'releve_des_comptes.commentaire','releve_des_comptes.wallet_carte']
    subscription: Subscription;
    soldeSuiviCompte: string;
    soldeCarteCompte: string;

    typeCompte: string = "2";
    dateDebut: string = new Date().toISOString().substring(0, 10);
    dateFin: string = new Date().toISOString().substring(0, 10);

    constructor(private passageService: PassageService,private toastr: ToastrService,private datePipe: DatePipe) {
        super();
    }

    ngOnInit(): void {
        this.passageService.appelURL(null);
        this.endpoint = environment.baseUrl + '/' + environment.suivi_compte;
        let soldeLocal = localStorage.getItem("soldeSuiviCompte");
        let soldeCarteLocal = localStorage.getItem("soldeCarteSuiviCompte");

        this.soldeSuiviCompte = (soldeLocal) ? soldeLocal : undefined;
        this.soldeCarteCompte = (soldeCarteLocal) ? soldeCarteLocal : undefined;

        console.log("soldeSuiviCompte", this.soldeSuiviCompte);
    }

    filtreTableau() {
 
        let filtre_etab = "" ;
        /*if(this.typeCompte != '2'){
            filtre_etab = "&releve_des_comptes.wallet_carte|e|"+this.typeCompte;
        }*/

        this.dateDebut = this.datePipe.transform(this.dateDebut, 'yyyy-MM-dd');
        this.dateFin = this.datePipe.transform(this.dateFin, 'yyyy-MM-dd');
      
        let filtreDate = "" ;
        if(this.dateDebut != '' && this.dateFin != ""){
            if( this.dateDebut > this.dateFin ){
              this.toastr.warning(this.__('msg.dateDebut_dateFin_error'),this.__("msg.warning"));
              return;
            }else{
              filtreDate = "&date_debut="+this.dateDebut +"&date_fin="+this.dateFin;
            }
        }
        
        let filtreParMulti =  filtre_etab + filtreDate ;
        this.passageService.appelURL(filtreParMulti);

    }

}
