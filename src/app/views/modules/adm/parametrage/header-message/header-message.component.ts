import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { PassageService } from 'app/services/table/passage.service';
import { environment } from 'environments/environment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
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
        {'icon' : 'edit','action' : 'edit','tooltip' : this.__('global.tooltip_edit'),'autority' : '',},
        {'icon' : 'delete','action' : 'delete','tooltip' : this.__('global.tooltip_delete'),'autority' : '',},
    ];

    searchGlobal = [];

    titleModal : string = "";
    modalRef?: BsModalRef;
    @ViewChild('updateHeaderMessage') updateHeaderMessage: TemplateRef<any> | undefined;

    constructor(
        private passageService: PassageService,
        private modalService: BsModalService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.passageService.appelURL(null);
        this.endpoint = environment.baseUrl + '/' + environment.header_message;
    }

    openUpdateModal()
    {
        this.titleModal = this.__('solde_bureau.info_solde');
        this.modalRef = this.modalService.show(this.updateHeaderMessage, {
            backdrop: 'static',
            keyboard: false
        });
    }

    // Fermeture du modal
    closeModal() {
        this.modalRef?.hide();
    }

}
