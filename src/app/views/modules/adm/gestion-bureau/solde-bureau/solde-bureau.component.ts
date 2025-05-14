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
        {"nomColonne" : this.__('global.date'),"colonneTable" : "datevirement","table" : "virement"},
        {"nomColonne" : this.__('global.montant') + "(" + this.__('global.currency') + ")","colonneTable" : "montant","table" : "virement"},
        {"nomColonne" : this.__('global.statut'),"colonneTable" : "statut","table" : "virement"},
        {"nomColonne" : this.__('global.date') +" "+ this.__('global.validation'),"colonneTable" : "datevalidation","table" : "virement"},
        {"nomColonne" : this.__('suivi_compte.type_compte'),"colonneTable" : "wallet_carte","table" : "virement"},
        {"nomColonne" : this.__('global.action')}
    ];

    objetBody = [
        {'name' : 'date_virement','type' : 'text',},
        {'name' : 'montant','type' : 'text',},
        {'name' : 'statut','type' : 'statut',},
        {'name' : 'date_validation','type' : 'text',},
        {'name' : 'wallet_carte','type' : 'text',},
        {'name' :  'state#rowid'}
    ];

    listIcon = [
        {'icon' : 'info','action' : 'edit','tooltip' : 'Modification','autority' : 'GCP_5',},
    ];

    subscription: Subscription;

    searchGlobal = [ 'virement.datevirement', 'virement.datevalidation', 'virement.user_crea','virement.user_validation']; 

    constructor(private passageService: PassageService,) {
        super();
    }

    ngOnInit(): void {
        this.passageService.appelURL(null);
        this.endpoint = environment.baseUrl + '/' + environment.historique_virement;

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
