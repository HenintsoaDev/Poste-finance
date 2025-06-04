import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { AuthService } from 'app/services/auth.service';
import { PassageService } from 'app/services/table/passage.service';
import { environment } from 'environments/environment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
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

    @ViewChild('detailTransaction') detailTransaction: TemplateRef<any> | undefined; 

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

    listTransactions = [];
    date_transaction: string;
    num_transac: string;
    client: string;
    service: string;
    montant: string;
    commission: string;
    montant_ttc: string;
    effectue_par: string;
    agence: string;
    wallet_carte: string;

    titleModal: string = "";
    modalRef?: BsModalRef;
    idTransaction: number;
    transactions: any = [];
    list_transactions_totaux: any;

    num_compte: any;
    type_recherche: any;
    telephoneSearch: any;
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
        private authService: AuthService,
        private modalService: BsModalService,
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

        this.subscription = this.passageService.getObservable().subscribe(event => {
  
            if( event.data){
                this.idTransaction = event.data.id;
  
                if (event.data.action == 'info') {
                    this.openModalTransaction();
                }
                this.passageService.clear();  // ==> à implémenter dans ton service
            }
        });

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
        if(this.typeCompte != "2") filtre_wallet_carte = "&where=transaction.wallet_carte|e|"+this.typeCompte;
        
        let filtre_telephone = '';
        if(this.telephoneSearch != undefined) {
            var telephone = this.telephoneSearch;
            telephone = telephone.replace('+', "00");
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
        this.telephoneSearch = "";
        this.typeCompte = "";
    }

    fermerPannel() {
        this.panel.close();
    }

    openModalTransaction()
    {
        this.recupererDonnee();

        if (this.modalRef) {
            this.modalRef.hide();
        }

        this.titleModal = this.__('transaction_jour.detail');
        this.modalRef = this.modalService.show(this.detailTransaction, {
            backdrop: 'static',
            keyboard: false,
            class: 'modal-lg'
        });
    }

    recupererDonnee()
    {
        // Récupérer la liste affichée dans le tableau depuis le localStorage.
        const storedData = localStorage.getItem('data');
        let result : any;
        if (storedData) result = JSON.parse(storedData);
        this.listTransactions = result.data;

        // Filtrer le tableau par rapport à l'ID et afficher le résultat dans le formulaire.
        let res = this.listTransactions.filter(_ => _.id == this.idTransaction);

        if (res.length != 0) { 
            let transactionSelected = res[0];
            this.date_transaction = transactionSelected.date_transaction;
            this.num_transac = transactionSelected.num_transac;
            this.client = transactionSelected.client;
            //this.telephone = transactionSelected.telephone;
            this.service = transactionSelected.service;
            this.montant = transactionSelected.montant;
            this.commission = transactionSelected.commission;
            this.montant_ttc = transactionSelected.montant_ttc;
            this.effectue_par = transactionSelected.effectue_par;
            this.agence = transactionSelected.agence;
            this.wallet_carte = transactionSelected.wallet_carte;
        }

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
        this.telephoneSearch = obj;
    }

    closeModal() {
        this.modalRef?.hide();
    }

    exportExcel() {
        const storedData = localStorage.getItem('data');
        let result: any;
        
        if (storedData) result = JSON.parse(storedData);
        this.transactions = result.data;
        this.list_transactions_totaux = result;

        let date_debut = this.datePipe.transform(this.dateDebut, 'dd-MM-yyyy');
        let date_fin = this.datePipe.transform(this.dateFin, 'dd-MM-yyyy');

        let title = this.__("historique_transaction.title") + ' ' ;
        if (this.type_recherche != undefined) {
            title  += this.type_recherche == "T" ? this.__("operation_compte.telephone") + " " + this.telephoneSearch + ' ' : this.__("operation_compte.num_compte") + " " + this.num_compte + ' '
        }
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

        let title = this.__("historique_transaction.title") + ' ';
        if (this.type_recherche != undefined) {
            title  += this.type_recherche == "T" ? this.__("operation_compte.telephone") + " " + this.telephoneSearch + ' ' : this.__("operation_compte.num_compte") + " " + this.num_compte + ' '
        }
        
        title += (date_debut != null ? " " + this.__("suivi_compte.from") + ' ' + date_debut + ' ' : '');       
        title += (date_fin != null ? " " + this.__("suivi_compte.to") + ' ' + date_fin + ' ' : '');  

        this.authService.exportPdf(this.print(this.transactions),title).then(
            (response: any)=>{},
            (error:any)=>{console.log(error)}
        );
    }

    print(transactions:any[]){

        let tab = transactions.map((transac: any, index: number) => {
          let t: any = {};
            t[this.__('global.date')] = transac.date_transaction;
            t[this.__('global.num_transac')] = transac.num_transac;
            t[this.__('global.nom_client')] = transac.client;
            //t[this.__('utilisateur.telephone')] = transac.telephone;
            t[this.__('global.service')] = transac.service;
            t[this.__('global.montant')] = transac.montant;
            t[this.__('service.frais')] = transac.commission;
            t[this.__('global.montant_brut')] = transac.montant_ttc;
            t[this.__('global.effectue_par')] = transac.effectue_par;
            t[this.__('global.agence')] = transac.agence;
            t[this.__('suivi_compte.type_compte')] = transac.wallet_carte;
                  
            return t;
        });



        // puis ajouter les totaux à la fin
        tab.push({
            [this.__('global.date')]: '',
            [this.__('global.num_transac')]: this.__('global.total_montant'),
            [this.__('global.nom_client')]: this.list_transactions_totaux?.total_montant ?? 0,
            //[this.__('utilisateur.telephone') ]: '',
            
            [this.__('global.service')]: '',
            [this.__('global.montant') ]: this.__('global.total_commission'),
            [this.__('service.frais') ]: this.list_transactions_totaux?.total_commission ?? 0,
            [this.__('global.montant_brut') ]: '',
            
            [this.__('global.effectue_par')]: this.__('global.total_ttc'),
            [this.__('global.agence')]: this.list_transactions_totaux?.total_ttc ?? 0,
            [this.__('suivi_compte.type_compte')]: '',
        });

        return tab;
    
    }

}
