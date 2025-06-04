import { OperationCompteService } from '../../../../../services/gestion-compte/operation-compte.service';
import { Component, OnInit } from '@angular/core';
import { Translatable } from 'shared/constants/Translatable';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-activer-compte',
  templateUrl: './activer-compte.component.html',
  styleUrls: ['./activer-compte.component.scss']
})
export class ActiverCompteComponent extends Translatable implements OnInit {

  num_compte: any;
  type_recherche: any;
  telephone: any;

  /**INPUT PHONE */
  objetPhone : any;
  element : any;
  currenCode :string ="mg";
  tel!: string;
  /**INPUT PHONE */

  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.Madagascar];
  selectedCountryISO = 'mg';
  phoneNumber = '';
  dialCode: any = '261';
  infoCompte: any[] = [];
  isDisabled :boolean = false;

  constructor(private operationService: OperationCompteService,private toastr: ToastrService, 

    ) {
    super();
   }

  ngOnInit(): void {
  }

  videForm(){
    this.type_recherche = null;
    this.num_compte = "";
    this.telephone = "";
    this.infoCompte = [];
    this.isDisabled=false;
  }


  rechercheBeneficiaire(){

    this.isDisabled = true;
    
    let type = null;
    if(this.type_recherche == "N") type = 1;
    else if(this.type_recherche == "T") type = 0;


    let telephone = "";
    if(this.telephone){
      telephone = this.telephone.replace('+', "00");
    }


    let data = {
      type_recherche: type,
      ...(type === 0 ? { telephone: telephone } : { num_compte: this.num_compte })
    };

    this.operationService.infoCompte(data).subscribe({
      next: (res) => {
          if(res['code'] == 200) {
            this.infoCompte = res['data'];
            this.telephone =  this.infoCompte['telephone'];

            
          }  else if(res['code'] == 404) {
            this.isDisabled=false;
            this.toastr.error(res['data'], this.__("global.error"));

          }
          else {
            this.isDisabled=false;
            this.toastr.error(res['msg'], this.__("global.error"));
          }
          
                        
        },
        error: (err) => {
        }
    }); 

  }


   // Ouverture de modal pour modification
   activerCompte() {
    let telephone = "";
    if(this.telephone){
      telephone = this.telephone.replace('+', "00");
    }

    let data = {
      'telephone' : telephone
    };
    

    Swal.fire({
      title: this.__("global.confirmation"),
      text: this.__("global.activer_compte_?"),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.__("global.oui_activer"),
      cancelButtonText: this.__("global.cancel"),
      allowOutsideClick: false,
      customClass: {
          confirmButton: 'swal-button--confirm-custom',
          cancelButton: 'swal-button--cancel-custom'
      },
      }).then((result) => {
      if (result.isConfirmed) {
     

           this.operationService.activerCompte(data).subscribe({
            next: (res) => {
                if(res['code'] == 201) {
                  this.toastr.success(res['data'], this.__("global.success"));
                  this.videForm();
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



  changePreferredCountries() {
    this.preferredCountries = [CountryISO.India, CountryISO.Canada];
  }


  telInputObject(m:any){
    this.objetPhone = m.s
    
  }

  onCountryChange(event: any) {
    this.dialCode = event.dialCode; // ← ici tu obtiens '261' ou '221'
    
  }

  controle(element:any){}

  hasError: boolean = false;
  onError(obj : any) {
      this.hasError = obj;
  }

  getNumber(obj : any) {
    this.telephone = obj;
  }

}
