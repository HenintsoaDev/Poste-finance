import { Component, OnInit } from '@angular/core';
import { PassageService } from 'app/services/table/passage.service';
import { environment } from 'environments/environment';
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
        {"nomColonne" : this.__('solde_bureau.type_bureau'),"colonneTable" : "type_agence","table" : "solde_bureau"},
        {"nomColonne" : this.__('solde_bureau.adresse') +" "+ this.__('global.validation'),"colonneTable" : "adresse","table" : "solde_bureau"},
        {"nomColonne" : this.__('solde_bureau.solde_wallet'),"colonneTable" : "solde_carte","table" : "solde_bureau"},
        {"nomColonne" : this.__('solde_bureau.solde_carte'),"colonneTable" : "solde","table" : "solde_bureau"},
        {"nomColonne" : ""}
    ];

    objetBody = [
        {'name' : 'code','type' : 'text',},
        {'name' : 'agence','type' : 'text',},
        {'name' : 'type_agence','type' : 'statut',},
        {'name' : 'adresse','type' : 'text',},
        {'name' : 'solde_carte','type' : 'text',},
        {'name' : 'solde','type' : 'text',},
        {'name' :  'state#rowid'}
    ];

    listIcon = [
        {'icon' : 'info','action' : 'edit','tooltip' : 'Détail','autority' : 'GBU_6',},
    ];

    subscription: Subscription;

    searchGlobal = []; 

    constructor(private passageService: PassageService,) {
        super();
    }

    ngOnInit(): void {
        this.passageService.appelURL(null);
        this.endpoint = environment.baseUrl + '/' + environment.solde_bureau;

        //Event for icon table
        this.subscription = this.passageService.getObservable().subscribe(event => {
            if(event.data){
                if(event.data.action == 'info')
                {
                    //Action pour edit;
                } 
        
                // Nettoyage immédiat de l'event
                this.passageService.clear();
            }
        });
    }

}
