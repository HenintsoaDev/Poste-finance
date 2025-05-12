import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HistoriqueVirementsService } from 'app/services/admin/gestion-compte-principal/historique-virement.service';
import { PassageService } from 'app/services/table/passage.service';
import { Auth } from 'app/shared/models/db';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Translatable } from 'shared/constants/Translatable';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-historique-virements',
  templateUrl: './historique-virements.component.html',
  styleUrls: ['./historique-virements.component.scss']
})
export class HistoriqueVirementsComponent extends Translatable implements OnInit {

    endpoint = "";
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
        {'icon' : 'edit','action' : 'edit','tooltip' : 'Modification','autority' : 'GCP_5',},
        {'icon' : 'check','action' : 'validation','tooltip' : 'Valider','autority' : 'GCP_6',},
        {'icon' : 'close','action' : 'rejeter','tooltip' : 'Rejeter','autority' : 'GCP_7',},
        {'icon' : 'delete','action' : 'delete','tooltip' : 'Supprimer','autority' : 'GCP_8',},
    ];

    searchGlobal = [ 'virement.datevirement', 'virement.datevalidation', 'virement.user_crea','virement.user_validation']; 
    subscription: Subscription;
    idVirement : number;

    soldeVirementCP: string;
    soldeVirementCarteCp: string;

    typeCompte: string = "2";
    dateDebut: string = new Date().toISOString().substring(0, 10);
    dateFin: string = new Date().toISOString().substring(0, 10);
    walletCarteProfil : string = "2";

    userStorage: Auth;

    constructor(private passageService: PassageService,private toastr: ToastrService,private datePipe: DatePipe, private hitsoriqueVirementService : HistoriqueVirementsService) {
        super();
    }

    ngOnInit(): void {
        this.passageService.appelURL(null);
        this.endpoint = environment.baseUrl + '/' + environment.historique_virement;

        let soldeLocalCP = localStorage.getItem(environment.soldeVirementCp);
        let soldeCarteLocalCP = localStorage.getItem(environment.soldeVirementCarteCp);

        this.soldeVirementCP = (soldeLocalCP) ? soldeLocalCP : undefined;
        this.soldeVirementCarteCp = (soldeCarteLocalCP) ? soldeCarteLocalCP : undefined;

        //Event for icon table
        this.subscription = this.passageService.getObservable().subscribe(event => {

            if(event.data){
                this.idVirement = event.data.id;
    
                if(event.data.action == 'edit') this.openModalDeleteVirement();
                else if(event.data.action == 'validation') this.openModalValidateVirement();
                else if(event.data.action == 'rejeter') this.openModalRejetVirement();
                else if(event.data.action == 'delete') this.openModalDeleteVirement();
                //else if(event.data.state == 0 || event.data.state == 1) this.openModalToogleStateModule();
        
                // Nettoyage immédiat de l'event
                this.passageService.clear();  // ==> à implémenter dans ton service
                
            }
            
        });
    }

    filtreTableau()
    {
        let filtre_search = "" ;
        if(this.typeCompte != '2'){
            filtre_search = ",virement.wallet_carte|e|"+this.typeCompte;
        }

        this.dateDebut = this.datePipe.transform(this.dateDebut, 'yyyy-MM-dd');
        this.dateFin = this.datePipe.transform(this.dateFin, 'yyyy-MM-dd');
      
        let filtreDate = "" ;
        if(this.dateDebut && this.dateFin){
            if( this.dateDebut > this.dateFin ){
              this.toastr.warning(this.__('msg.dateDebut_dateFin_error'),this.__("msg.warning"));
              return;
            }else{
              filtreDate = "&date_debut="+this.dateDebut +"&date_fin="+this.dateFin;
            }
        }
        
        let filtreParMulti =  filtre_search + filtreDate + "&_order_=desc,date_transaction";
        this.passageService.appelURL(filtreParMulti);
    }

    //Validate virement
    openModalValidateVirement() {
        Swal.fire({
            title: this.__("global.confirmation"),
            text: this.__("virement.validate_virement") + " ?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: this.__("virement.oui_valider"),
            cancelButtonText: this.__("global.cancel"),
            allowOutsideClick: false,
            customClass: {
                confirmButton: 'swal-button--confirm-custom',
                cancelButton: 'swal-button--cancel-custom'
            },
        }).then((result) => {
            if (result.isConfirmed) {
                this.hitsoriqueVirementService.validerVirement(this.idVirement).subscribe({
                    next: (res) => {
                        if(res['code'] == 201) {
                            this.toastr.success(res['msg'], this.__("global.success"));
                            this.actualisationTableau();
                        }
                        else{
                            this.toastr.error(res['msg'], this.__("global.error"));
                        }                
                    },
                    error: (err) => {}
                });
            }
        });
    }

    //Rejet virement
    openModalRejetVirement() {
        Swal.fire({
            title: this.__("global.confirmation"),
            text: this.__("virement.rejet_virement") + " ?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: this.__("virement.oui_rejeter"),
            cancelButtonText: this.__("global.cancel"),
            allowOutsideClick: false,
            customClass: {
                confirmButton: 'swal-button--confirm-custom',
                cancelButton: 'swal-button--cancel-custom'
            },
        }).then((result) => {
            if (result.isConfirmed) {
                this.hitsoriqueVirementService.rejeterVirement(this.idVirement).subscribe({
                    next: (res) => {
                        if(res['code'] == 201) {
                            this.toastr.success(res['msg'], this.__("global.success"));
                            this.actualisationTableau();
                        }
                        else{
                            this.toastr.error(res['msg'], this.__("global.error"));
                        }                
                    },
                    error: (err) => {}
                });
            }
        });
    }

    // Suppression virement
    openModalDeleteVirement() {
    
        Swal.fire({
            title: this.__("global.confirmation"),
            text: this.__("global.supprimer_donnee_?"),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: this.__("global.oui_supprimer"),
            cancelButtonText: this.__("global.cancel"),
            allowOutsideClick: false,
            customClass: {
                confirmButton: 'swal-button--confirm-custom',
                cancelButton: 'swal-button--cancel-custom'
            },
        }).then((result) => {
            if (result.isConfirmed) {
                
                this.hitsoriqueVirementService.deleteVirement(this.idVirement).subscribe({
                    next: (res) => {
                        if(res['code'] == 204) {
                            this.toastr.success(res['msg'], this.__("global.success"));
                            this.actualisationTableau();
                        }
                        else{
                            this.toastr.error(res['msg'], this.__("global.error"));
                        }                
                    },
                    error: (err) => {}
                });
    
            }
        });
    
    }

    // Actualisation des données
    actualisationTableau(){
        this.passageService.appelURL('');
    }

}
