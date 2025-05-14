import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BureauService } from 'app/services/admin/gestion-bureau/bureau.service';
import { AuthService } from 'app/services/auth.service';
import { PassageService } from 'app/services/table/passage.service';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Translatable } from 'shared/constants/Translatable';

@Component({
  selector: 'app-releve-solde-bureau',
  templateUrl: './releve-solde-bureau.component.html',
  styleUrls: ['./releve-solde-bureau.component.scss']
})
export class ReleveSoldeBureauComponent extends Translatable implements OnInit {

    endpoint = "";
    header = [
        {"nomColonne" :  this.__('suivi_compte.date'),"colonneTable" : "date_transaction","table" : "releve_solde_agence"},
        {"nomColonne" :  this.__('suivi_compte.num_transac'),"colonneTable" : "num_transac","table" : "releve_solde_agence"},
        {"nomColonne" :  this.__('suivi_compte.solde_avant'),"colonneTable" : "solde_avant","table" : "releve_solde_agence"},
        {"nomColonne" :  this.__('suivi_compte.montant') + '(' + this.__('global.currency') + ')',"colonneTable" : "montant","table" : "releve_solde_agence"},
        {"nomColonne" :  this.__('suivi_compte.solde_apres'),"colonneTable" : "solde_apres","table" : "releve_solde_agence"},
        {"nomColonne" :  this.__('suivi_compte.operation'),"colonneTable" : "operation","table" : "releve_solde_agence"},
        {"nomColonne" :  this.__('suivi_compte.coms'),"colonneTable" : "commentaire","table" : "releve_solde_agence"},
        {"nomColonne" :  this.__('suivi_compte.type_compte'),"colonneTable" : "wallet_carte","table" : "releve_solde_agence"}
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
    ]

    listIcon = [];
    searchGlobal = [ 'releve_des_comptes.date_transaction', 'releve_des_comptes.operation', 'releve_des_comptes.commentaire','releve_des_comptes.wallet_carte']
    subscription: Subscription;

    typeCompte: string;
    dateDebut: string; //new Date().toISOString().substring(0, 10);
    dateFin: string; //new Date().toISOString().substring(0, 10);
    walletCarteProfil : string = "2";

    listBureauActive = [];
    agenceId : any;

    showDataTable = false;
    loadingData = false;

    constructor(
        private passageService: PassageService,
        private toastr: ToastrService, 
        private authService: AuthService,
        private datePipe: DatePipe,
        private bureauService : BureauService
    ) {
        super();
    }

    ngOnInit(): void {
        this.passageService.appelURL(null);
        this.bureauService.getAgenceBureauActive().subscribe({
            next: (res) => {
                if(res['code'] == 200) {
                    console.log(res);
                    this.listBureauActive = res['data']
                }
                else{
                    this.toastr.error(res['msg'], this.__("global.error"));
                }               
            },
            error: (err) => {}
        });
    }

    async filtreTableau() {
 
        let filtre_search = "" ;
        filtre_search = ",releve_solde_agence.wallet_carte|e|"+this.typeCompte;

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
        
        this.loadingData = true;
        this.showDataTable = false;
        this.endpoint = environment.baseUrl + '/' + environment.releve_solde_bureau; 
        let filtreParMulti =  filtre_search + filtreDate + "&__order__=desc,date_transaction&agence=" + this.agenceId;
        await this.passageService.appelURL(filtreParMulti);
        this.loadingData = false;
        this.showDataTable = true;

    }

}
