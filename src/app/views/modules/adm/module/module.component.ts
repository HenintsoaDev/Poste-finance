import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModuleService } from 'app/services/admin/module.service';
import { PassageService } from 'app/services/table/passage.service';
import { module } from 'app/shared/models/db';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Translatable } from 'shared/constants/Translatable';
import Swal from 'sweetalert2';

declare var bootstrap: any;

@Component({
  selector: 'app-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.scss']
})
export class ModuleComponent extends Translatable implements OnInit {

  
/***************************************** */
endpoint = "";
header = [
  {
    "nomColonne" : "Name",
    "colonneTable" : "name",
    "table" : "module"
  },
  {
    "nomColonne" : "Code",
    "colonneTable" : "code",
    "table" : "module"
  },
  {
    "nomColonne" : "Icon",
    "colonneTable" : "icon",
    "table" : "module"
  },
  {
    "nomColonne" : "Action"
  }

  
 
]

objetBody = [
        {
          'name' : 'name',
          'type' : 'text',
        },
        {
          'name' : 'code',
          'type' : 'text',
        },
        {
          'name' : 'icon',
          'type' : 'text',
        },
        {'name' :  'id'}

        
      
]
listIcon = [
  {
    'icon' : 'edit',
    'action' : 'edit'
  },
  {
    'icon' : 'delete',
    'action' : 'delete'
  },
]

searchGlobal = ['module.name', 'module.code', 'module.icon']
 
@ViewChild('saisirCIN') saisirCIN: TemplateRef<any> | undefined;
  minlength: number = 12;
  maxlength: number = 12;
 
/***************************************** */



  moduleForm: FormGroup;
  module: module = new module();
  @ViewChild('myModal', { static: false }) modalElement!: ElementRef;


  constructor(private fb: FormBuilder,  
              private toastr: ToastrService, 
              private moduleService: ModuleService,     
              private passageService: PassageService,
    ) {
    super();
   }




subscription: Subscription;

  async ngOnInit() {

     /***************************************** */
        // Écouter les changements de modal à travers le service si il y a des actions
        this.subscription = this.passageService.getObservable().subscribe(data => {

          console.log("Passe???????", data)

      // if(data.action == 'edit') this.openModalEditEnseignant();
      // else this.openModalAffectEtablissementEnseignant();
       // Ouvrir le modal
    });
        this.endpoint = environment.baseUrl + '/' + environment.module;
    /***************************************** */

        this.moduleForm = this.fb.group({
          name: ['', Validators.required],
          code: ['', [Validators.required]],
          icon: ['', [Validators.required]]
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


  onSubmit() {
    if (this.moduleForm.valid) {

        Swal.fire({
          title: this.__("global.confirmation"),
          text: this.__("global.enregistrer_donnee_?"),
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: this.__("global.oui_enregistrer"),
          cancelButtonText: this.__("global.cancel"),
          allowOutsideClick: false,
          customClass: {
              confirmButton: 'swal-button--confirm-custom',
              cancelButton: 'swal-button--cancel-custom'
          },
          }).then((result) => {
          if (result.isConfirmed) {

            this.moduleService.ajoutModule(this.module).subscribe({
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

    
      } else {
          alert("Veuillez remplir tous les champs correctement.");
      }
  }

  closeModal() {
    const modalInstance = bootstrap.Modal.getInstance(this.modalElement.nativeElement);
    if (modalInstance) {
      modalInstance.hide();
    }
  }

  actualisationTableau(){
    this.passageService.appelURL('');
 }


}
