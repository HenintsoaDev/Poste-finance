import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PassageService } from 'app/services/table/passage.service';
import { service } from 'app/shared/models/db';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Translatable } from 'shared/constants/Translatable';
import Swal from 'sweetalert2';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from 'app/services/auth.service';
import { ServiceService } from 'app/services/admin/parametre/service.service';
declare var bootstrap: any;
@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent extends Translatable implements OnInit {

  modalRef?: BsModalRef;
  
  /***************************************** */
  endpoint = "";
  header = [
    
    {
      "nomColonne" : this.__('service.code'),
      "colonneTable" : "code",
      "table" : "service"
    },
    {
      "nomColonne" : this.__('service.label'),
      "colonneTable" : "label",
      "table" : "service"
    },
    {
      "nomColonne" : this.__('service.frais'),
      "colonneTable" : "frais",
      "table" : "service"
    },
   
    {
      "nomColonne" : this.__('global.action')
    }
  
      
    
    ]
  
  objetBody = [
          {
            'name' : 'code',
            'type' : 'text',
          },
          {
            'name' : 'label',
            'type' : 'text',
          },
        
          {
            'name' : 'frais',
            'type' : 'text',
          },
        
          {'name' :  'state#rowid'}
  ]
  
  listIcon = [
    {
      'icon' : 'info',
      'action' : 'detail',
      'tooltip' : this.__('global.tooltip_detail'),
      'autority' : 'PRM_36',
  
    },
    {
      'icon' : 'edit',
      'action' : 'edit',
      'tooltip' : this.__('global.tooltip_edit'),
      'autority' : 'PRM_10'
    },
    {
      'icon' : 'delete',
      'action' : 'delete',
      'tooltip' : this.__('global.tooltip_delete'),
      'autority' : 'PRM_12'
    },
    {
      'icon' : 'state',
      'autority' : 'PRM_13',
    },
  ]
  
    searchGlobal = [ 'service.code', 'service.label', 'service.frais']
   
    /***************************************** */
  
  
  
    serviceForm: FormGroup;
    service: service = new service();
    listservices:service [] = [];
  
    @ViewChild('addService') addService: TemplateRef<any> | undefined;
    @ViewChild('detailService') detailService: TemplateRef<any> | undefined;

    idService : number;
    titleModal: string = "";
    type_frais: string = "";
    distributeur: string = "";
  
  
    constructor(private fb: FormBuilder,  
                private toastr: ToastrService, 
                private serviceService: ServiceService,     
                private passageService: PassageService,
                private modalService: BsModalService,
                private authService : AuthService
      ) {
      super();
    }
  
  
  
  
  subscription: Subscription;
  
    async ngOnInit() {
  
      this.authService.initAutority("PRM","ADM");
  
      this.titleModal = this.__('service.title_add_modal');
  
          this.passageService.appelURL(null);
  
       /***************************************** */
          // Écouter les changements de modal à travers le service si il y a des actions
          this.subscription = this.passageService.getObservable().subscribe(event => {
  
            if(event.data){
              this.idService = event.data.id;
  
              if(event.data.action == 'edit') this.openModalEditService();
              else if(event.data.action == 'detail') this.openModalDetailService();
              else if(event.data.action == 'delete') this.openModalDeleteService();
              else if(event.data.state == 0 || event.data.state == 1) this.openModalToogleStateService();
      
              // Nettoyage immédiat de l'event
              this.passageService.clear();  // ==> à implémenter dans ton service
            
            }
           
      });
          this.endpoint = environment.baseUrl + '/' + environment.service;
      /***************************************** */
  
          this.serviceForm = this.fb.group({
            label: ['', Validators.required],
            code: ['', [Validators.required]],
            type_frais: ['', [Validators.required]],
            montant_frais: [''],
            distributeur: ['', [Validators.required]],
            taux_distributeur: [''],
        });
    }
  
    ngOnDestroy() {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    }
  
    // Quand on faire l'ajout ou modification
    onSubmit() {

      const isMontantFraisObligatoire = this.type_frais === 'F';
      const isTauxDistributeurObligatoire = this.distributeur === 'O';

      this.serviceForm = this.fb.group({
        label: [this.service.label, Validators.required],
        code: [this.service.code, Validators.required],
        type_frais: [this.type_frais, Validators.required],
        montant_frais: [this.service.montant, isMontantFraisObligatoire ? Validators.required : []],
        distributeur: [this.distributeur, Validators.required],
        taux_distributeur: [this.service.taux_distributeur, isTauxDistributeurObligatoire ? Validators.required : []],
      });

      this.service.type_frais = (this.type_frais == 'F') ? 0 : 1;
      this.service.distributeur = (this.distributeur == 'O') ? 1 : 0;

      if (this.serviceForm.valid) {
  
        let msg = "";
        let msg_btn = "";
  
        if(!this.service.rowid){
           msg = this.__("global.enregistrer_donnee_?");
           msg_btn = this.__("global.oui_enregistrer");
        }else{
           msg = this.__("global.modifier_donnee_?");
           msg_btn = this.__("global.oui_modifier");
        }
  
          Swal.fire({
            title: this.__("global.confirmation"),
            text: msg,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: msg_btn,
            cancelButtonText: this.__("global.cancel"),
            allowOutsideClick: false,
            customClass: {
                confirmButton: 'swal-button--confirm-custom',
                cancelButton: 'swal-button--cancel-custom'
            },
            }).then((result) => {
            if (result.isConfirmed) {
  
              if(!this.service.rowid){
                console.log("add")
  
                 this.serviceService.ajoutService(this.service).subscribe({
                  next: (res) => {
                      if(res['code'] == 201) {
                        this.toastr.success(res['msg'], this.__("global.success"));
                        this.actualisationTableau();
                        this.closeModal();
                      }
                      else if(res['code'] == 400){
                        if(res['data'].code) this.toastr.error(res['data'].code[0], this.__("global.error"));
                        else this.toastr.error(res['data'], this.__("global.error"));
                      }else{
                          this.toastr.error(res['msg'], this.__("global.error"));
                      }                
                    },
                    error: (err) => {
                    }
                }); 
  
              }else{
                console.log("edit")


                let dataService = {
                  "rowid": this.service.rowid,
                  "code": this.service.code,
                  "label": this.service.label,
                  "frais": this.service.frais,
                  "distributeur": this.service.distributeur,
                  "taux_distributeur": this.service.taux_distributeur,
                  "type_frais": this.service.type_frais,
                  "montant": this.service.montant
                }
                
                 this.serviceService.modifierService(dataService).subscribe({
                  next: (res) => {
                      if(res['code'] == 201) {
                        this.toastr.success(res['msg'], this.__("global.success"));
                        this.actualisationTableau();
                        this.closeModal();
                      }
                      else{
                          this.toastr.error(res['msg'], this.__("global.error"));
                      }                
                    },
                    error: (err) => {
                    }
                }); 
              }
  
             
  
  
              
              }
          });
  
      
        } else {
            alert("Veuillez remplir tous les champs correctement.");
        }
    }
  
    // Ouverture de modal pour modification
    openModalEditService() {
  
      this.titleModal = this.__('service.title_edit_modal');
  
      if (this.addService) {
  
        this.recupererDonnee();

        this.type_frais = (this.service.type_frais == 0) ? 'F' : 'P';
        this.distributeur = (this.service.distributeur == 1) ? 'O' : 'N';
        this.service.montant = this.service.frais;

        // Ouverture de modal
        this.modalRef = this.modalService.show(this.addService, { backdrop: 'static',keyboard: false });
      }
    }
  
    async openModalDetailService() {
  
  
      this.titleModal = this.__('profil.title_detail_modal');
  
      if (this.detailService) {
  
       this.recupererDonnee();
  
        // Ouverture de modal
        this.modalRef = this.modalService.show(this.detailService, {
          class: 'modal-xl',backdrop:"static"
        });
      }
  
    }
     // SUppression d'un modal
     openModalDeleteService() {
  
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
  
             this.serviceService.supprimerService(this.idService).subscribe({
              next: (res) => {
                  if(res['code'] == 204) {
                    this.toastr.success(res['msg'], this.__("global.success"));
                    this.actualisationTableau();
                  }
                  else{
                      this.toastr.error(res['msg'], this.__("global.error"));
                  }                
                },
                error: (err) => {
                }
            }); 
  
        
  
  
          
          }
      });
  
    }
  
  
      // Ouverture de modal pour modification
      openModalToogleStateService() {
       
        
        this.recupererDonnee();
  
        Swal.fire({
          title: this.__("global.confirmation"),
          text: this.__("global.changer_state_?"),
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: this.__("global.oui_changer"),
          cancelButtonText: this.__("global.cancel"),
          allowOutsideClick: false,
          customClass: {
              confirmButton: 'swal-button--confirm-custom',
              cancelButton: 'swal-button--cancel-custom'
          },
          }).then((result) => {
          if (result.isConfirmed) {
            let state = 0;
            if(this.service.state == 1) state = 0;
            else state = 1;
  
    
               this.serviceService.changementStateService(this.service, state).subscribe({
                next: (res) => {
                    if(res['code'] == 201) {
                      this.toastr.success(res['msg'], this.__("global.success"));
                      this.actualisationTableau();
                    }
                    else{
                        this.toastr.error(res['msg'], this.__("global.error"));
                    }                
                  },
                  error: (err) => {
                  }
              }); 
    
          
    
    
            
            }
        });
    
      }
    
  
  
    // Ouverture du modal pour l'ajout
    openModalAdd(template: TemplateRef<any>) {
      this.titleModal = this.__('service.title_add_modal');
      this.service = new service();
  
      this.modalRef = this.modalService.show(template, {
        backdrop: 'static',
        keyboard: false
      });
    }
  
    // Récuperation des données via plocal
    recupererDonnee(){
      // Récupérer la liste affichée dans le tableau depuis le localStorage.
      const storedData = localStorage.getItem('data');
      let result : any;
      if (storedData) result = JSON.parse(storedData);
      this.listservices = result.data;
      // Filtrer le tableau par rapport à l'ID et afficher le résultat dans le formulaire.
      let res = this.listservices.filter(_ => _.rowid == this.idService);
      this.service = res[0];
    }
  
    // Actualisation des données
    actualisationTableau(){
      this.passageService.appelURL('');
   }
  
   // Fermeture du modal
    closeModal() {
      this.modalRef?.hide();
    }
}
