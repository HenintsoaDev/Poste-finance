import { OperationCompteService } from '../../../../../services/gestion-compte/operation-compte.service';
import { Component, OnInit } from '@angular/core';
import { Translatable } from 'shared/constants/Translatable';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-chercher-compte',
  templateUrl: './chercher-compte.component.html',
  styleUrls: ['./chercher-compte.component.scss']
})
export class ChercherCompteComponent extends Translatable implements OnInit {

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

    this.operationService.chercheCompte(data).subscribe({
      next: (res) => {
          if(res['code'] == 200) {
            this.toastr.success(res['msg'], this.__("global.success"));
            this.infoCompte = res['data'];
            
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
