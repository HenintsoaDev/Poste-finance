import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HistoriqueVirementsService } from 'app/services/admin/gestion-compte-principal/historique-virement.service';
import { PassageService } from 'app/services/table/passage.service';
import { Auth } from 'app/shared/models/db';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Translatable } from 'shared/constants/Translatable';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'app-detail-rechargement',
  templateUrl: './detail-rechargement.component.html',
  styleUrls: ['./detail-rechargement.component.scss']
})
export class DetailRechargementComponent extends Translatable implements OnInit {
  endpoint = "";
  header = [
      {"nomColonne" : this.__('dashboard.date'),"colonneTable" : "date_transaction","table" : "transaction"},
      {"nomColonne" : this.__('dashboard.num_transac'),"colonneTable" : "num_transac","table" : "transaction"},
      {"nomColonne" : this.__('dashboard.montant') + "(" + this.__('global.currency') + ")","colonneTable" : "montant","table" : "transaction", "align": "right"},
      {"nomColonne" : this.__('dashboard.frais') + "(" + this.__('global.currency') + ")","colonneTable" : "montant","table" : "transaction", "align": "right"},
      {"nomColonne" : this.__('dashboard.beneficiaire'),"colonneTable" : "nom","table" : "beneficiaire"},
      {"nomColonne" : this.__('dashboard.num_compte'),"colonneTable" : "num_compte","table" : "carte"},
      {"nomColonne" : this.__('dashboard.wallet_carte'),"colonneTable" : "wallet_carte","table" : "transaction"},
      {"nomColonne" : this.__('dashboard.agence'),"colonneTable" : "agence","table" : "bureau"},
  ];

  objetBody = [
      {'name' : 'date_transaction','type' : 'text',},
      {'name' : 'num_transac','type' : 'text',},
      {'name' : 'montant','type' : 'montant',},
      {'name' : 'commission','type' : 'montant',},
      {'name' : 'beneficiaire','type' : 'text',},
      {'name' : 'numcompte','type' : 'text',},
      {'name' : 'wallet_carte','type' : 'text',},
      {'name' : 'agence','type' : 'text',},
  ];

  listIcon = [
     
  ];

  searchGlobal = [ 'transaction.date_transaction', 'transaction.num_transac', 'agence.name','transaction.montant','beneficiaire.nom','carte.numcompte']; 
  subscription: Subscription;
  idVirement : number;

  soldeVirementCP: string;
  soldeVirementCarteCp: string;

  typeCompte: string = "";
  dateDebut: string = "" //new Date().toISOString().substring(0, 10);
  dateFin: string = ""//new Date().toISOString().substring(0, 10);

  showDataTable = false;
  loadingData = false;
  transactions: any = [];
  list_transactions_totaux: any;

  constructor(
    private passageService: PassageService,
    private toastr: ToastrService,
    private datePipe: DatePipe, 
    private hitsoriqueVirementService : HistoriqueVirementsService,
    private modalService: BsModalService,
    private authService: AuthService
) {
    super();
}

ngOnInit(): void {
  this.endpoint = environment.baseUrl + '/' + environment.details_rechargement; 
  //this.passageService.clear();
  
  this.passageService.clear();

  /***************************************** */
     // Écouter les changements de modal à travers le service si il y a des actions
     this.subscription = this.passageService.getObservable().subscribe(event => {

       if( event.data){

         // Nettoyage immédiat de l'event
         this.passageService.clear();  // ==> à implémenter dans ton service
   
       }
      
     
 });
 /***************************************** */

 
}

ngOnDestroy() {
  if (this.subscription) {
    this.subscription.unsubscribe();
  }
}

async filtreTableau() {
 
  let filtre_search = "" ;
  filtre_search = ",transaction.wallet_carte|e|"+this.typeCompte;

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
  let filtreParMulti =  filtre_search + filtreDate;
  await this.passageService.appelURL(filtreParMulti);
  this.loadingData = false;
  this.showDataTable = true;

}

 
exportExcel() {
  const storedData = localStorage.getItem('data');
  let result: any;
  
  if (storedData) result = JSON.parse(storedData);
  this.transactions = result.data;
  this.list_transactions_totaux = result;

  let date_debut = this.datePipe.transform(this.dateDebut, 'dd-MM-yyyy');
    let date_fin = this.datePipe.transform(this.dateFin, 'dd-MM-yyyy');

    let title = this.__("transaction_agent.title") + ' ';

  
    const mapTypeCompte: { [key: string]: string } = { '0': "("+this.__("global.wallet") + ")", '1': "("+this.__("global.carte")+ ")",};
    title += mapTypeCompte[this.typeCompte] || '';
    title += (date_debut != null ? " " + this.__("suivi_compte.from") + ' ' + date_debut + ' ' : '');       
    title += (date_fin != null ? " " + this.__("suivi_compte.to") + ' ' + date_fin + ' ' : '');  

  this.authService.exportExcel(this.print(this.transactions), title).then(
      (response: any)=>{
            let a = document.createElement("a"); 
            a.href = response.data;
            a.download = `${title}.xlsx`;
            a.click(); 
      },
      (error:any)=>{
        console.log(error)
      }
  );
}

exportPdf() {
    const storedData = localStorage.getItem('data');
    let result: any;
    
    if (storedData) result = JSON.parse(storedData);
    this.transactions = result.data;
    this.list_transactions_totaux = result;

    let date_debut = this.datePipe.transform(this.dateDebut, 'dd-MM-yyyy');
    let date_fin = this.datePipe.transform(this.dateFin, 'dd-MM-yyyy');

    let title = this.__("transaction_agent.title") + ' ';

  
    const mapTypeCompte: { [key: string]: string } = { '0': "("+this.__("global.wallet") + ")", '1': "("+this.__("global.carte")+ ")",};
    title += mapTypeCompte[this.typeCompte] || '';
    title += (date_debut != null ? " " + this.__("suivi_compte.from") + ' ' + date_debut + ' ' : '');       
    title += (date_fin != null ? " " + this.__("suivi_compte.to") + ' ' + date_fin + ' ' : '');  

    this.authService.exportPdf(this.print(this.transactions),title).then(
        (response: any)=>{},
        (error:any)=>{console.log(error)}
    );
}

print(transactions:any[]){
  console.log("ss")
  let tab = transactions.map((transac: any, index: number) => {
    let t: any = {};
    t[this.__('dashboard.date')] = transac.date_transaction;
    t[this.__('dashboard.num_transac')] = transac.num_transac;
    t[this.__('dashboard.agence')] = transac.agence;
    t[this.__('dashboard.montant')] = transac.montant;
    t[this.__('dashboard.frais')] = transac.commission;
    t[this.__('dashboard.beneficiaire')] = transac.beneficiaire;
    t[this.__('dashboard.num_compte')] = transac.numcompte;
    t[this.__('dashboard.wallet_carte')] = transac.wallet_carte;
    
    return t; // ✅ ici
  });

    console.log("aaa")

                // puis ajouter les totaux à la fin
          tab.push({
            [this.__('dashboard.date')]: this.__('global.total_montant'),
            [this.__('dashboard.num_transac')]: this.list_transactions_totaux?.total_montant ?? 0,
            
            [this.__('dashboard.agence') ]: this.__('global.total_commission'),
            [this.__('dashboard.montant') ]: this.list_transactions_totaux?.total_commission ?? 0,
            [this.__('dashboard.frais') ]: '',
            
            [this.__('dashboard.beneficiaire')]: this.__('global.total_ttc'),
            [this.__('dashboard.num_compte')]: this.list_transactions_totaux?.total_ttc ?? 0,
            [this.__('dashboard.wallet_carte')]: '',
        });
        




    return tab;

}


}
