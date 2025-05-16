import { Component, OnInit } from '@angular/core';
import { PassageService } from 'app/services/table/passage.service';
import { environment } from 'environments/environment';
import { Translatable } from 'shared/constants/Translatable';

@Component({
  selector: 'app-header-message',
  templateUrl: './header-message.component.html',
  styleUrls: ['./header-message.component.scss']
})
export class HeaderMessageComponent extends Translatable implements OnInit {

    endpoint = "";
    header = [
        {"nomColonne" :  this.__('header_message.expediteur'),"colonneTable" : "expediteur","table" : "header_message"},
        {"nomColonne" :  this.__('header_message.message'),"colonneTable" : "txt_messenger","table" : "header_message"},
        {"nomColonne" :  this.__('header_message.publie'),"colonneTable" : "publie","table" : "header_message"},
        {"nomColonne" :  this.__('header_message.module'),"colonneTable" : "module","table" : "header_message"},
        {"nomColonne" : this.__('global.action')}
    ];

    objetBody = [
        {'name' : 'expediteur','type' : 'text',},
        {'name' : 'txt_messenger','type' : 'text',},
        {'name' : 'publie','type' : 'montant',},
        {'name' : 'module','type' : 'text',},
        {'name' : 'state#rowid',},
    ];

    listIcon = [
        {'icon' : 'state','autority' : '',},
        {'icon' : 'edit','action' : 'edit','tooltip' : 'Modification','autority' : '',},
        {'icon' : 'delete','action' : 'delete','tooltip' : 'Supprimer','autority' : '',},
    ];

    searchGlobal = [];

    constructor(private passageService: PassageService) {
        super();
    }

    ngOnInit(): void {
        this.passageService.appelURL(null);
        this.endpoint = environment.baseUrl + '/' + environment.header_message;
    }

}
