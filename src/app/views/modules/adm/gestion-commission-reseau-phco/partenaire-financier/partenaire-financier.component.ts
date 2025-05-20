import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { PartenaireFinancierService } from 'app/services/admin/gestion-commission/partenaire-financier.service';
import { PassageService } from 'app/services/table/passage.service';
import { environment } from 'environments/environment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Translatable } from 'shared/constants/Translatable';

@Component({
  selector: 'app-partenaire-financier',
  templateUrl: './partenaire-financier.component.html',
  styleUrls: ['./partenaire-financier.component.scss']
})
export class PartenaireFinancierComponent extends Translatable implements OnInit {

    endpoint : any;
            
    header = [
        {"nomColonne" : this.__('global.name'),"colonneTable" : "nom","table" : "partenaire_financier"},
        {"nomColonne" : this.__('utilisateur.email'),"colonneTable" : "email","table" : "partenaire_financier"},
        {"nomColonne" : this.__('global.wallet'),"colonneTable" : "solde","table" : "partenaire_financier"},
        {"nomColonne" : this.__('global.carte'),"colonneTable" : "solde_carte","table" : "partenaire_financier"},
        {"nomColonne" : this.__('global.state'),"colonneTable" : "etat","table" : "partenaire_financier"},
        {"nomColonne" : ""}
    ];

    objetBody = [
        {'name' : 'nom','type' : 'text',},
        {'name' : 'email','type' : 'text',},
        {'name' : 'solde','type' : 'text',},
        {'name' : 'solde_carte','type' : 'text',},
        {'name' : 'state_label','type' : 'text',},
        {'name' : 'id'}
    ];

    listIcon = [
        {'icon' : 'info','action' : 'info','tooltip' : 'Détail','autority' : '',},
    ];

    subscription: Subscription;
    searchGlobal = ["partenaire_financier.nom","partenaire_financier.email"]; 

    titleModal : string = "";
    modalRef?: BsModalRef;

    code : string;
    namePartenaire : string;
    mailPartenaire : string;
    isWalletCarte : number;

    tauxCommissionSunupaye : number;
    tauxCommissionService : number;

    tauxCommissionSunupayeCarte : number;
    tauxCommissionServiceCarte : number;

    @ViewChild('newPartenaire') newPartenaire: TemplateRef<any> | undefined;

    constructor(
        private passageService: PassageService,
        private modalService: BsModalService,
        private partenaireFinancierService: PartenaireFinancierService,
        private toastr: ToastrService
    ) {
        super()
    }

    ngOnInit(): void {
        this.passageService.appelURL(null);
        this.endpoint = environment.baseUrl + '/' + environment.partenaire_financier;
        /*this.subscription = this.passageService.getData().subscribe((data) => {
            if (data) {
                this.dataSolde = data;
            }
        });*/
    }

    openModalAddPartenaire()
    {
        this.titleModal = this.__('partenaire.add_new_partenaire');
        this.modalRef = this.modalService.show(this.newPartenaire, {
            backdrop: 'static',
            keyboard: false,
            class: 'modal-xl'
        });
    }

    sendNewPartenaire()
    {
        this.partenaireFinancierService.addPartenaire({
            'code' : this.code,
            'nom' : this.namePartenaire,
            'email' : this.mailPartenaire,
            'taux_commission_service' : this.tauxCommissionService,
            'taux_commission_service_carte' : this.tauxCommissionServiceCarte,
            'taux_commission_sunupaye' : this.tauxCommissionSunupaye,
            'taux_commission_sunupaye_carte' : this.tauxCommissionSunupayeCarte,
            'wallet_carte' : this.isWalletCarte
        }).subscribe((response) => {
            if (response['code'] == 201) {
                this.passageService.appelURL(this.endpoint);
                this.toastr.success(response.msg, this.__("global.success"));
                this.closeModal();
            }
        });
    }

    // Fermeture du modal
    closeModal() {
        this.modalRef?.hide();
    }

}
