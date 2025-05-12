import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PassageService } from 'app/services/table/passage.service';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Translatable } from 'shared/constants/Translatable';

@Component({
  selector: 'app-historique-virements',
  templateUrl: './historique-virements.component.html',
  styleUrls: ['./historique-virements.component.scss']
})
export class HistoriqueVirementsComponent extends Translatable implements OnInit {

    endpoint = "";
    header = [
        {"nomColonne" : this.__('global.date'),"colonneTable" : "datevirement","table" : "virement"},
        {"nomColonne" : this.__('global.statut'),"colonneTable" : "statut","table" : "virement"},
        {"nomColonne" : this.__('global.montant') + "(" + this.__('global.currency') + ")","colonneTable" : "montant","table" : "virement"},
        {"nomColonne" : this.__('global.date') +" "+ this.__('global.validation'),"colonneTable" : "datevalidation","table" : "virement"},
        {"nomColonne" : this.__('global.user_creation'),"colonneTable" : "user_crea","table" : "virement"},
        {"nomColonne" : this.__('global.user_validation'),"colonneTable" : "user_validation","table" : "virement"},
        {"nomColonne" : this.__('suivi_compte.type_compte'),"colonneTable" : "wallet_carte","table" : "virement"}
    ];

    objetBody = [
        {'name' : 'date_virement','type' : 'text',},
        {'name' : 'statut','type' : 'text',},
        {'name' : 'montant','type' : 'text',},
        {'name' : 'date_validation','type' : 'text',},
        {'name' : 'user_crea','type' : 'text',},
        {'name' : 'user_validation','type' : 'text',},
        {'name' : 'wallet_carte','type' : 'text',}
    ];

    listIcon = [];
    searchGlobal = [ 'virement.datevirement', 'virement.datevalidation', 'virement.user_crea','virement.user_validation']; 

    soldeVirementCP: string;
    soldeVirementCarteCp: string;

    constructor(private passageService: PassageService,private toastr: ToastrService,private datePipe: DatePipe) {
        super();
    }

    ngOnInit(): void {
        this.passageService.appelURL(null);
        this.endpoint = environment.baseUrl + '/' + environment.historique_virement;

        let soldeLocalCP = localStorage.getItem(environment.soldeVirementCp);
        let soldeCarteLocalCP = localStorage.getItem(environment.soldeVirementCarteCp);

        this.soldeVirementCP = (soldeLocalCP) ? soldeLocalCP : undefined;
        this.soldeVirementCarteCp = (soldeCarteLocalCP) ? soldeCarteLocalCP : undefined;
    }

}
