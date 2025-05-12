import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { PassageService } from 'app/services/table/passage.service';
import { Auth } from 'app/shared/models/db';
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

    endpoint = "";
    header = [
        {"nomColonne" : this.__('suivi_compte.date'),"colonneTable" : "date_transaction","table" : "releve_des_comptes"},
        {"nomColonne" :  this.__('suivi_compte.num_transac'),"colonneTable" : "num_transac","table" : "releve_des_comptes"},
        {"nomColonne" :  this.__('suivi_compte.solde_avant'),"colonneTable" : "solde_avant","table" : "releve_des_comptes"},
        {"nomColonne" :  this.__('suivi_compte.solde_apres'),"colonneTable" : "solde_apres","table" : "releve_des_comptes"},
        {"nomColonne" :  this.__('suivi_compte.montant') + '(' + this.__('global.currency') + ')',"colonneTable" : "montant","table" : "releve_des_comptes"},
        {"nomColonne" :  this.__('suivi_compte.operation'),"colonneTable" : "operation","table" : "releve_des_comptes"},
        {"nomColonne" :  this.__('suivi_compte.coms'),"colonneTable" : "commentaire","table" : "releve_des_comptes"},
        {"nomColonne" :  this.__('suivi_compte.type_compte'),"colonneTable" : "wallet_carte","table" : "releve_des_comptes"}
    ];

    objetBody = [
        {'name' : 'date_transaction','type' : 'text',},
        {'name' : 'num_transac','type' : 'text',},
        {'name' : 'solde_avant','type' : 'montant',},
        {'name' : 'solde_apres','type' : 'montant',},
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
    dateDebut: string = ''; //new Date().toISOString().substring(0, 10);
    dateFin: string =  ''; //new Date().toISOString().substring(0, 10);
    walletCarteProfil : string = "2";

    //UserStorage
    userStorage: Auth;
    suivi_comptes: any = [];

    constructor(private passageService: PassageService,private toastr: ToastrService,private datePipe: DatePipe, private authService: AuthService) {
        super();
    }

    ngOnInit(): void {
        this.passageService.appelURL(null);
        
        this.endpoint = environment.baseUrl + '/' + environment.suivi_compte;
        let soldeLocal = localStorage.getItem(environment.soldeSuiviCompte);
        let soldeCarteLocal = localStorage.getItem(environment.soldeCarteSuiviCompte);

        this.soldeSuiviCompte = (soldeLocal) ? soldeLocal : undefined;
        this.soldeCarteCompte = (soldeCarteLocal) ? soldeCarteLocal : undefined;
        this.userStorage = JSON.parse(localStorage.getItem(environment.userItemName) || null);
        this.typeCompte = this.userStorage.info?.wallet_carte.toString();
        this.walletCarteProfil = this.userStorage.info?.wallet_carte.toString();
        
    }

    filtreTableau() {
 
        let filtre_etab = "" ;
        if(this.typeCompte != '2'){
            filtre_etab = ",releve_des_comptes.wallet_carte|e|"+this.typeCompte;
        }

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
        
        let filtreParMulti =  filtre_etab + filtreDate + "&__order__=desc,date_transaction";
        this.passageService.appelURL(filtreParMulti);

    }


    async exportExcel(fileName) {

        const storedData = localStorage.getItem('data');
        let result : any;
        if (storedData) {
          result = JSON.parse(storedData);
        }
    
        this.suivi_comptes = result.data;
    
        
        this.authService.exportExcel(this.print(this.suivi_comptes),this.__("suivi_compte.list_suivi_compte")).then(
          (response: any)=>{
            console.log('respons beee',response)
                let a = document.createElement("a"); 
                a.href = response.data;
                a.download = `${fileName}.xlsx`;
                a.click(); 
          },
          (error:any)=>{
            console.log(error)
          }
        );
      }

      async exportPdf(fileName) {

        const storedData = localStorage.getItem('data');
        let result : any;
        if (storedData) {
          result = JSON.parse(storedData);
        }
    
        this.suivi_comptes = result.data;
    
        
        this.authService.exportPdf(this.print(this.suivi_comptes),this.__("suivi_compte.list_suivi_compte")).then(
          (response: any)=>{
            
          },
          (error:any)=>{
            console.log(error)
          }
        );
      }
    
      print(suivis:any[]){
        return  suivis.map((suivi : any)=>{
          let t = {}
          t[this.__('suivi_compte.date')] =  this.datePipe.transform(suivi.date_transaction, 'dd/MM/YYYY') 
          t[this.__('suivi_compte.num_transac')] = suivi.num_transac 
          t[this.__('suivi_compte.solde_avant')] = suivi.solde_avant 
          t[this.__('suivi_compte.solde_apres')] = suivi.solde_apres
          t[this.__('suivi_compte.montant')] = suivi.montant
          t[this.__('suivi_compte.operation')] = suivi.operation
          t[this.__('suivi_compte.coms')] = suivi.commentaire
          t[this.__('suivi_compte.type_compte')] = suivi.wallet_carte

           
          return t ;
        })  || [];
    
      }
    


}
