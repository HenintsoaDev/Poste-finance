import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { Translatable } from 'shared/constants/Translatable';

@Component({
  selector: 'app-beneficiare',
  templateUrl: './beneficiare.component.html',
  styleUrls: ['./beneficiare.component.scss']
})
export class BeneficiareComponent extends Translatable implements OnInit {

    endpoint = "";
    header = [
        {"nomColonne" :  this.__('global.name'),"colonneTable" : "nom","table" : "beneficiaire"},
        {"nomColonne" :  this.__('utilisateur.email'),"colonneTable" : "email","table" : "beneficiaire"},
        {"nomColonne" :  this.__('utilisateur.adresse'),"colonneTable" : "adresse","table" : "beneficiaire"},
        {"nomColonne" : this.__('suivi_compte.type_compte'), "colonneTable": "wallet_carte", "table": "beneficiaire" },
        {"nomColonne" :  this.__('global.date'),"colonneTable" : "date_creation","table" : "beneficiaire"},
        {"nomColonne" :  this.__('global.agence'),"colonneTable" : "agence","table" : "beneficiaire"},
        {"nomColonne" :  this.__('global.statut'),"colonneTable" : "state_value","table" : "beneficiaire"},
        {"nomColonne" : this.__('global.action')}
    ];

    objetBody = [
        {'name' : 'nom','type' : 'text',},
        {'name' : 'email','type' : 'text',},
        {'name' : 'adresse','type' : 'montant',},
        { 'name': 'wallet_carte', 'type': 'text', },
        {'name' : 'date_creation','type' : 'text',},
        {'name' : 'agence','type' : 'text',},
        {'name' : 'state_value','type' : 'montant',},
        {'name' : 'rowid',},
    ];

    listIcon = [
        {'icon' : 'info','action' : 'info','tooltip' : 'Détail','autority' : '',},
    ];

    nom: string;
    prenom : string;
    email: string;
    adresse: string;
    wallet_carte: number;
    date_nais: string;
    agence: number;
    state_value: string;
    rowid: string;
    sexe: string;
    cni: string;
    matricule: string;
    date_delivrance: string;
    fk_typecni: number;
    type_carte: number;

    searchGlobal = [];

    subscription: Subscription;

    titleModal : string = "";
    modalRef?: BsModalRef;
    
    constructor() {
        super();
    }

    ngOnInit(): void {
        this.endpoint = environment.baseUrl + '/' + environment.beneficiaire;
    }

}
