import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { PassageService } from 'app/services/table/passage.service';
import { environment } from 'environments/environment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { Translatable } from 'shared/constants/Translatable';

@Component({
  selector: 'app-transaction-jour',
  templateUrl: './transaction-jour.component.html',
  styleUrls: ['./transaction-jour.component.scss']
})
export class TransactionJourComponent extends Translatable implements OnInit {

    @ViewChild('detailTransaction') detailTransaction: TemplateRef<any> | undefined; 

    endpoint = "";
    header = [
        { "nomColonne": this.__('global.date'), "colonneTable": "date_transaction", "table": "transaction" },
        {"nomColonne" :  this.__('global.num_transac'),"colonneTable" : "num_transac","table" : "transaction"},
        {"nomColonne" :  this.__('global.nom_client'),"colonneTable" : "client","table" : "transaction"},
        {"nomColonne" :  this.__('utilisateur.telephone'),"colonneTable" : "telephone","table" : "transaction"},
        {"nomColonne" : this.__('global.service'), "colonneTable": "service", "table": "transaction" },
        {"nomColonne" :  this.__('global.montant'),"colonneTable" : "montant","table" : "transaction"},
        {"nomColonne" :  this.__('service.frais'),"colonneTable" : "commission","table" : "transaction"},
        { "nomColonne": this.__('global.montant_brut'), "colonneTable": "montant_ttc", "table": "transaction" },
        {"nomColonne" :  this.__('global.effectue_par'),"colonneTable" : "effectue_par","table" : "transaction"},
        {"nomColonne" :  this.__('global.agence'),"colonneTable" : "agence","table" : "transaction"},
        {"nomColonne" :  this.__('suivi_compte.type_compte'),"colonneTable" : "wallet_carte","table" : "transaction"},
        {"nomColonne" : this.__('global.action')}
    ];

    objetBody = [
        {'name' : 'date_transaction', 'type': 'text', },
        {'name' : 'num_transac','type' : 'text',},
        { 'name': 'client', 'type': 'text', },
        {'name' : 'telephone','type' : 'text',},
        {'name' : 'service','type' : 'text',},
        { 'name': 'montant', 'type': 'montant', },
        {'name' : 'commission','type' : 'montant',},
        {'name' : 'montant_ttc','type' : 'montant',},
        { 'name': 'effectue_par', 'type': 'text', },
        {'name' : 'agence','type' : 'text',},
        {'name' : 'wallet_carte','type' : 'text',},
        {'name' : 'id',},
    ];

    listIcon = [
        {'icon' : 'info','action' : 'info','tooltip' : this.__('global.tooltip_detail'),'autority' : '',},
    ];

    searchGlobal = ['transaction.num_transac'];
    subscription: Subscription;
    listTransactions = [];
    date_transaction: string;
    num_transac: string;
    client: string;
    telephone: string;
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

    constructor(
        private passageService: PassageService,
        private modalService: BsModalService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.endpoint = environment.baseUrl + '/' + environment.reporting_transaction;
        this.passageService.appelURL(null);

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
            this.telephone = transactionSelected.telephone;
            this.service = transactionSelected.service;
            this.montant = transactionSelected.montant;
            this.commission = transactionSelected.commission;
            this.montant_ttc = transactionSelected.montant_ttc;
            this.effectue_par = transactionSelected.effectue_par;
            this.agence = transactionSelected.agence;
            this.wallet_carte = transactionSelected.wallet_carte;
        }

    }

    ngOnDestroy() {
        if (this.subscription) {
          this.subscription.unsubscribe();
        }
    }

    closeModal() {
        this.modalRef?.hide();
    }

}
