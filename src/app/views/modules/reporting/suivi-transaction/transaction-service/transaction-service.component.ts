import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BureauService } from 'app/services/admin/gestion-bureau/bureau.service';
import { AuthService } from 'app/services/auth.service';
import { RessourceService } from 'app/services/ressource.service';
import { PassageService } from 'app/services/table/passage.service';
import { environment } from 'environments/environment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Translatable } from 'shared/constants/Translatable';

@Component({
  selector: 'app-transaction-service',
  templateUrl: './transaction-service.component.html',
  styleUrls: ['./transaction-service.component.scss']
})
export class TransactionServiceComponent extends Translatable implements OnInit {

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
    ];

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
    transactions: any = [];
    list_transactions_totaux: any;

    

    showDataTable = false;
    loadingData = false;
    listShow = false;

    typeCompte: string;
    dateDebut: string; //new Date().toISOString().substring(0, 10);
    dateFin: string; //new Date().toISOString().substring(0, 10);

    listBureauActive = [];
    agenceId: number = -1;
    searchControlBureau = new FormControl('');
    filteredBureau = [];

    listServiceActive = [];
    searchControlService = new FormControl('');
    serviceId: number = -1;
    filteredService = [];
    

    constructor(
        private passageService: PassageService,
        private modalService: BsModalService,
        private authService: AuthService,
        private bureauService: BureauService,
        private toastr: ToastrService, 
        private datePipe: DatePipe, 
        private ressourceService: RessourceService
    ) {
        super();
    }

    ngOnInit(): void {

        this.endpoint = environment.baseUrl + '/' + environment.reporting_transaction_service; 
        this.passageService.clear();

        this.bureauService.getAgenceBureauActive().subscribe({
            next: (res) => {
                if(res['code'] == 200) {
                    console.log(res);
                    this.listBureauActive = res['data'];
                    this.filteredBureau = this.listBureauActive;
                }
                else{
                    this.toastr.error(res['msg'], this.__("global.error"));
                }               
            },
            error: (err) => {}
        });

        this.ressourceService.getServiceProduct().subscribe({
            next: (res) => {
                if(res['code'] == 200) {
                    console.log(res);
                    this.listServiceActive = res['data'];
                    this.filteredService = this.listServiceActive;
                }
                else{
                    this.toastr.error(res['msg'], this.__("global.error"));
                }               
            },
            error: (err) => {}
        });

        this.searchControlBureau.valueChanges.subscribe(value => {
            const lower = value?.toLowerCase() || '';
            this.filteredBureau = this.listBureauActive.filter(bureau =>
                bureau.name.toLowerCase().includes(lower)
            );
        });

        this.searchControlService.valueChanges.subscribe(value => {
            const lower = value?.toLowerCase() || '';
            this.filteredService = this.listServiceActive.filter(service =>
                service.label.toLowerCase().includes(lower)
            );
        });
    }

    ngOnDestroy() {
        if (this.subscription) {
          this.subscription.unsubscribe();
        }
    }

    filtreTableau() {
        this.showDataTable = true;

        let agence = "";
        console.log("AGENCE : ",this.agenceId)
        if (this.agenceId != -1 && this.agenceId != undefined) agence = ",agence.rowid|e|" + this.agenceId;

        let filtre_wallet_carte = '';
        if (this.typeCompte != "2" && this.typeCompte != undefined) filtre_wallet_carte = "transaction.wallet_carte|e|" + this.typeCompte;
        
        let where = "";
        if ((this.agenceId != -1 && this.agenceId != undefined) || (this.typeCompte != "2" && this.typeCompte != undefined)) where = "&where=";
        
        let service = "";
        if(this.serviceId != -1) service = "&service=" + this.serviceId;
        
        
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
        
        let filtreParMulti = service + filtreDate + where + filtre_wallet_carte + agence;
        this.passageService.appelURL(filtreParMulti);
        this.showDataTable = true;

    }

    exportExcel(){}
    
    exportPdf(){}

}
