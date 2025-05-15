import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { PassageService } from 'app/services/table/passage.service';
import { environment } from 'environments/environment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { Translatable } from 'shared/constants/Translatable';

@Component({
  selector: 'app-solde-bureau',
  templateUrl: './solde-bureau.component.html',
  styleUrls: ['./solde-bureau.component.scss']
})
export class SoldeBureauComponent extends Translatable implements OnInit {

    endpoint : any;
    
    header = [
        {"nomColonne" : this.__('solde_bureau.code'),"colonneTable" : "code","table" : "solde_bureau"},
        {"nomColonne" : this.__('solde_bureau.agence'),"colonneTable" : "agence","table" : "solde_bureau"},
        //{"nomColonne" : this.__('solde_bureau.type_bureau'),"colonneTable" : "type_agence","table" : "solde_bureau"},
        {"nomColonne" : this.__('solde_bureau.adresse') +" "+ this.__('global.validation'),"colonneTable" : "adresse","table" : "solde_bureau"},
        {"nomColonne" : this.__('solde_bureau.solde_wallet'),"colonneTable" : "solde_carte","table" : "solde_bureau"},
        {"nomColonne" : this.__('solde_bureau.solde_carte'),"colonneTable" : "solde","table" : "solde_bureau"},
        {"nomColonne" : ""}
    ];

    objetBody = [
        {'name' : 'code','type' : 'text',},
        {'name' : 'agence','type' : 'text',},
        //{'name' : 'type_agence','type' : 'statut',},
        {'name' : 'adresse','type' : 'text',},
        {'name' : 'solde_carte','type' : 'text',},
        {'name' : 'solde','type' : 'text',},
        {'name' :  'state#rowid'}
    ];

    listIcon = [
        {'icon' : 'info','action' : 'info','tooltip' : 'Détail','autority' : 'GBU_6',},
    ];

    subscription: Subscription;

    searchGlobal = []; 
    dataSolde : any;
    idSolde : any;

    titleModal: string = "";
    modalRef?: BsModalRef;

    @ViewChild('infoSolde') infoSolde: TemplateRef<any> | undefined;

    constructor(
        private passageService: PassageService,
        private modalService: BsModalService
    ) {
        super();
    }

    ngOnInit(): void {
        this.passageService.appelURL(null);
        this.endpoint = environment.baseUrl + '/' + environment.solde_bureau;

        //Event for icon table
        this.subscription = this.passageService.getObservable().subscribe(event => {
            if(event.data){
                this.idSolde = event.data.id;
                if(event.data.action == 'info')
                {this.openModalInfoSolde();} 
        
                // Nettoyage immédiat de l'event
                this.passageService.clear();
            }
        });
    }

    openModalInfoSolde()
    {
        this.recupererDonnee();
        this.titleModal = this.__('solde_bureau.info_solde');
        this.modalRef = this.modalService.show(this.infoSolde, {
            backdrop: 'static',
            keyboard: false
        });
    }

    // Récuperation des données
    recupererDonnee(){
        // Récupérer la liste affichée dans le tableau depuis le localStorage.
        const storedData = localStorage.getItem('data');
        let result : any;
        if (storedData) result = JSON.parse(storedData);
        this.dataSolde = result.data;

        // Filtrer le tableau par rapport à l'ID et afficher le résultat dans le formulaire.
        let res = this.dataSolde.filter(_ => _.rowid == this.idSolde);
        if(res.length != 0){
            this.dataSolde = res[0];
        }
    }

    // Fermeture du modal
    closeModal() {
        this.modalRef?.hide();
    }

}
