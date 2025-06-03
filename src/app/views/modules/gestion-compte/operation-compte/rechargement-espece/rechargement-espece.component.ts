import { OperationCompteService } from '../../../../../services/gestion-compte/operation-compte.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Translatable } from 'shared/constants/Translatable';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { ToastrService } from 'ngx-toastr';
import formatNumber from 'number-handler'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { SoldeService } from 'app/services/solde.service';
import { WalletService } from 'app/services/changementSolde.service';

@Component({
  selector: 'app-rechargement-espece',
  templateUrl: './rechargement-espece.component.html',
  styleUrls: ['./rechargement-espece.component.scss']
})
export class RechargementEspeceComponent extends Translatable implements OnInit {
  
  formatNumber : any = formatNumber;
  @ViewChild('codeValidation') codeValidation: TemplateRef<any> | undefined;
  modalRef?: BsModalRef;

  num_compte: any;
  type_recherche: any;
  telephone: any;
  motifs:any;
  montant= "";
  calcul : any;

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
  infoCompte: any = [];
  isDisabled :boolean = false;
  type_frais: any;
  titleModal: string ="";
  code_validation: any = "";
  attente: boolean = false;
  showPrint: boolean = false;
  walletSolde: String;

  constructor(private operationService: OperationCompteService,private toastr: ToastrService, private modalService: BsModalService, private soldeService: SoldeService, private walletService: WalletService ) {
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
            this.infoCompte = res['data'];
            this.telephone =  this.infoCompte.carte.telephone;
            this.calcul = [];
            this.montant = '';
            this.motifs = '';
            this.type_frais = '';
           

            
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


  calculRecharge(typeFrais = null) {

    this.type_frais = typeFrais
    console.log(typeFrais);

    if(typeFrais != null && this.montant){

        let data = {
          "type_frais" : typeFrais,
          "montant" : this.montant,
          "service_id" : 5
        };
        
    
        this.operationService.calculeRecharge(data).subscribe({
          next: (res) => {
            this.calcul = res;
            this.isDisabled = false;
          },
          error: (err) => {}
      });
  
    }
    
  }

  envoiCodeRechargement(){

    let solde = this.soldeService.getWalletSolde();

    const cleaned = solde.replace(/\s/g, '').replace(',', '.');
    const walletSolde = Math.floor(parseFloat(cleaned));


    if(walletSolde< this.calcul?.montant_total){
      this.toastr.error(this.__('operation_compte.solde_bureau_insuffisant'), this.__("global.error"));
    }else{

      let telephone = "";
      if(this.telephone){
        telephone = this.telephone.replace('+', "00");
      }
      
    let data = {
      montant: this.calcul?.montant_total,
      montant_recharge: this.calcul?.montant_recharge,
      type_rechargement: this.type_frais,
      motifs: this.motifs,
      telephone: telephone,
    };
  
  
  
              Swal.fire({
                title: this.__("global.confirmation"),
                text: this.__("global.valider_?"),
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: this.__("global.oui_valider"),
                cancelButtonText: this.__("global.cancel"),
                allowOutsideClick: false,
                customClass: {
                    confirmButton: 'swal-button--confirm-custom',
                    cancelButton: 'swal-button--cancel-custom'
                },
            }).then((result) => {
                if (result.isConfirmed) {
                  this.isDisabled=true;
  
                  this.operationService.envoieCodeRecharge(data).subscribe({
                    next: (res) => {
                        if(res['code'] == 200) {
                          this.isDisabled=false;
                          this.openModalDetailDemande();
                          this.code_validation = "";
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
            });

    }

   


  }



    // Detail d'un modal
    async openModalDetailDemande() {
      this.titleModal = this.__('operation_compte.entry_code_validation');
      this.showPrint = false;
  
      this.isDisabled = false;
      if (this.codeValidation) {
        // Ouverture de modal
        this.modalRef = this.modalService.show(this.codeValidation, {
          class: 'modal-lg', backdrop:"static"
        });
      }
  
    }

    // Fermeture du modal
    closeModal() {
      this.modalRef?.hide();
    }

    fermerModal(){
      this.modalRef?.hide();
      this.videForm();
    }



    rechargeEspece(){

      let telephone = "";
      if(this.telephone){
        telephone = this.telephone.replace('+', "00");
      }
      
    let data = {
      "montant": this.montant,
      "code": this.code_validation,
      "type_frais": this.type_frais,
      "motifs": this.motifs,
      "telephone": telephone,
    };
  
    this.isDisabled=true;
    this.attente = true;
    console.log("xxx", data);
    this.operationService.rechargeCompte(data).subscribe({
      next: (res) => {
        this.attente = false;

        if(res['code'] == 201) {
            this.toastr.success(res['msg'], this.__("global.success"));
            this.isDisabled=false;
            

            this.soldeService.getSoldeUser().subscribe({
              next: (res) => {

                let montant = {
                  "walletSolde" : res.data.solde,
                  "carteSolde" : res.data.solde_carte	
                }
                this.walletService.setWalletCarte(montant);
              }
          });
          this.closeModal();
          this.showPrint = true;

          }
          else if(res['code'] == 404){
            this.isDisabled=false;
            this.toastr.error(res['data'], this.__("global.error"));

          }else {
            this.isDisabled=false;
            this.toastr.error(res['msg'], this.__("global.error"));
          }
          
                        
        },
        error: (err) => {
        }
    }); 
  
  
    }
  


}
