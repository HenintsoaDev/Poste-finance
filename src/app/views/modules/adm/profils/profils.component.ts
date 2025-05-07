import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProfilService } from 'app/services/admin/profil.service';
import { PassageService } from 'app/services/table/passage.service';
import { module, profil, type_profil } from 'app/shared/models/db';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { map, startWith, Subscription, Subject, takeUntil } from 'rxjs';
import { Translatable } from 'shared/constants/Translatable';
import Swal from 'sweetalert2';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from 'app/services/auth.service';
declare var bootstrap: any;

@Component({
  selector: 'app-profils',
  templateUrl: './profils.component.html',
  styleUrls: ['./profils.component.scss']
})
export class ProfilsComponent extends Translatable implements OnInit {

    /***************************************** */
    endpoint = "";
    header = [
      
      {
        "nomColonne" : this.__('profil.code'),
        "colonneTable" : "code",
        "table" : "profil"
      },
      {
        "nomColonne" : this.__('profil.name'),
        "colonneTable" : "name",
        "table" : "profil"
      },
      {
        "nomColonne" : this.__('profil.wallet_carte'),
        "colonneTable" : "wallet_carte",
        "table" : "profil"
      },
      {
        "nomColonne" : this.__('profil.type'),
        "colonneTable" : "name",
        "table" : "type_profil"
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
              'name' : 'name',
              'type' : 'text',
            },
            {
              'name' : 'wallet_carte_label',
              'type' : 'text',
            },
            
            {
              'name' : 'type_profil_name',
              'type' : 'text',
            },
          
            {'name' :  'state#id'}
    ]
    
    listIcon = [
      {
        'icon' : 'handshake',
        'action' : 'affect',
        'tooltip' : 'Affectation profil',
        'autority' : 'PRM_2',
    
      },
      {
        'icon' : 'edit',
        'action' : 'edit',
        'tooltip' : 'Modification',
        'autority' : 'PRM_2',
    
      },
      {
        'icon' : 'delete',
        'action' : 'delete',
        'tooltip' : 'Supression',
        'autority' : 'PRM_3',
  
    
      },
    ]
    
      searchGlobal = [ 'profil.code', 'profil.name', 'type_profil.name']
     
      /***************************************** */
    
    
      subscription: Subscription;
      profilForm: FormGroup;
      profil: profil = new profil();
      listProfils:profil [] = [];
      types:type_profil [] = [];
      wallet_carte: string;
  
      @ViewChild('addprofil') addProfil: TemplateRef<any> | undefined;
      @ViewChild('affectationprofil') affectationprofil: TemplateRef<any> | undefined;
      idProfil : number;
      titleModal: string = "";
      modalRef?: BsModalRef;
      
      filteredTypes: type_profil[] = [];
      searchControl = new FormControl('');
  
      constructor(private fb: FormBuilder,  
                  private toastr: ToastrService, 
                  private ProfilService: ProfilService,     
                  private passageService: PassageService,
                  private modalService: BsModalService,
                  private authService : AuthService
    
        ) {
        super();
        this.authService.initAutority("PRM");
  
      }
    
    
    
    
    
      async ngOnInit() {
        this.titleModal = this.__('profil.title_add_modal');
    
        this.passageService.appelURL(null);
  
         /***************************************** */
            // Écouter les changements de modal à travers le service si il y a des actions
            this.subscription = this.passageService.getObservable().subscribe(event => {
    
              this.idProfil = event.data.id;
    
            if(event.data.action == 'edit') this.openModalEditProfil();
            else if(event.data.action == 'delete') this.openModalDeleteProfil();
            else if(event.data.action == 'affect') this.openModalAffectProfil();
            else if(event.data.state == 0 || event.data.state == 1) this.openModalToogleStateProfil();
            
            // Nettoyage immédiat de l'event
            this.passageService.clear();  // ==> à implémenter dans ton service
          
        });
            this.endpoint = environment.baseUrl + '/' + environment.profil;
        /***************************************** */
    
            this.profilForm = this.fb.group({
              name: ['', Validators.required],
              code: ['', [Validators.required]],
              wallet_carte: ['', [Validators.required]],
              type_profil_id: ['', [Validators.required]]
          });
  
  
          
  
  
      }
  
     
     
    
      ngOnDestroy() {
        if (this.subscription) {
          this.subscription.unsubscribe();
        }
      }
    
      // Quand on faire l'ajout ou modification
      onSubmit() {
  
        console.log(this.profil);
        if (this.profilForm.valid) {
    
            let msg = "";
            let msg_btn = "";
            
      
            if(!this.profil.id){
              msg = this.__("global.enregistrer_donnee_?");
              msg_btn = this.__("global.oui_enregistrer");
            }else{
              msg = this.__("global.modifier_donnee_?");
              msg_btn = this.__("global.oui_modifier");
            }

            if(this.wallet_carte == 'W') this.profil.wallet_carte = 0;
            else if(this.wallet_carte == 'C') this.profil.wallet_carte = 1;
            else if(this.wallet_carte == 'WC') this.profil.wallet_carte = 2;
      
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
    
                if(!this.profil.id){
                  console.log("add")
    
                   this.ProfilService.ajoutProfil(this.profil).subscribe({
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
                   this.ProfilService.modifierProfil(this.profil).subscribe({
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
      openModalEditProfil() {
    
        this.titleModal = this.__('profil.title_edit_modal');
  
        if (this.addProfil) {
    
          this.recupererDonnee();

          if(this.profil.wallet_carte == 0) this.wallet_carte = 'W';
          else if(this.profil.wallet_carte == 1) this.wallet_carte = 'C' ;
          else if(this.profil.wallet_carte == 2) this.wallet_carte = 'WC' ;

          this.actualisationSelect();

          // Ouverture de modal
          this.modalRef = this.modalService.show(this.addProfil, { backdrop: 'static',keyboard: false });
        }
      }
    

        // Ouverture de modal pour modification
        openModalAffectProfil() {
    
          this.titleModal = this.__('profil.title_edit_modal');
    
          if (this.affectationprofil) {
      
            this.recupererDonnee();
                      this.actualisationSelect();
  
            // Ouverture de modal
            this.modalRef = this.modalService.show(this.affectationprofil, {
              class: 'modal-xl'
            });
          }
        }
      
    
       // SUppression d'un modal
       openModalDeleteProfil() {
    
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
    
               this.ProfilService.supprimerProfil(this.idProfil).subscribe({
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
        openModalToogleStateProfil() {
    
          console.log("ssssssssssssxxxxxx");
    
          
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
              if(this.profil.state == 1) state = 0;
              else state = 1;
    
      
                 this.ProfilService.changementStateProfil(this.profil, state).subscribe({
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
      async openModalAdd(template: TemplateRef<any>) {
        this.titleModal = this.__('profil.title_add_modal');
        this.profil = new profil();
        this.actualisationSelect();
        this.modalRef = this.modalService.show(template, {
          backdrop: 'static',
          keyboard: false
        });
      }
  
      async actualisationSelect(){
        this.types = await this.authService.getSelectList(environment.liste_type_profil_active,['name']);
        this.filteredTypes = this.types;
  
        this.searchControl.valueChanges.subscribe(value => {
          const lower = value?.toLowerCase() || '';
          this.filteredTypes = this.types.filter(type =>
            type.name.toLowerCase().includes(lower)
          );
        });
      }
  
     
      // Actualisation des données
      actualisationTableau(){
        this.passageService.appelURL('');
     }

     // Récuperation des données
     recupererDonnee(){

        // Récupérer la liste affichée dans le tableau depuis le localStorage.
        const storedData = localStorage.getItem('data');
        let result : any;
        if (storedData) result = JSON.parse(storedData);
        this.listProfils = result.data;

        // Filtrer le tableau par rapport à l'ID et afficher le résultat dans le formulaire.
        let res = this.listProfils.filter(_ => _.id == this.idProfil);
        if(res.length != 0){
          this.profil = res[0];
        }
     }
    
     // Fermeture du modal
      closeModal() {
        this.modalRef?.hide();
      }
  
    
}
