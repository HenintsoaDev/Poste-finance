import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Translatable } from 'shared/constants/Translatable';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { RessourceService } from 'app/services/ressource.service';
import { ToastrService } from 'ngx-toastr';
import { BeneficiaireService } from 'app/services/gestion-compte/beneficiaire.service';
import Swal from 'sweetalert2';
import { BureauService } from 'app/services/admin/gestion-bureau/bureau.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-creation-compte',
  templateUrl: './creation-compte.component.html',
  styleUrls: ['./creation-compte.component.scss']
})
export class CreationCompteComponent extends Translatable implements OnInit {

    nom: string;
    prenom : string;
    email: string;
    adresse: string;
    wallet_carte: number;
    date_nais: string;
    agence: number;
    state_value: string;
    rowid: string;
    sexe: string;
    cni: string;
    matricule: string;
    date_delivrance: string;
    fk_typecni: number;
    type_carte: number = 0;
    beneficiaireSelected: any;
    bureauLabel: string;

    beneficiareForm: FormGroup;

    //Bureau agence
    listBureauActive = [];
    filteredBureau = [];
    searchControl = new FormControl('');

    /**INPUT PHONE */
        telephone: any;
        objetPhone : any;
        element : any;
        currenCode :string ="mg";
        tel!: string;
        separateDialCode = false;
        SearchCountryField = SearchCountryField;
        CountryISO = CountryISO;
        PhoneNumberFormat = PhoneNumberFormat;
        preferredCountries: CountryISO[] = [CountryISO.Madagascar];
        selectedCountryISO = 'mg';
        phoneNumber = '';
        dialCode: any = '261';
        phoneForm = new FormGroup({
            phone: new FormControl(undefined, [Validators.required])
        });
    /**INPUT PHONE */
    
    listtypecarte = [];
    loading : boolean = false;

    constructor(
        private fb: FormBuilder, 
        private ressourceService: RessourceService,
        private toastr: ToastrService,
        private bureauService: BureauService,
        private beneficiaireService: BeneficiaireService,
        private datePipe: DatePipe, 
        private router: Router, 
    ) {
        super();
    }

    ngOnInit(): void {
        this.beneficiareForm = this.fb.group({
            nom: ['', Validators.required],
            prenom: [''],
            adresse: ['', Validators.required],
            email: ['', [Validators.required]],
            telephone: ['', [Validators.required,  Validators.minLength(9), Validators.maxLength(9)]],
            //agence: ['', [Validators.required]],
            cni: ['', Validators.required], 
            sexe: ['',Validators.required],
            date_nais: ['', [Validators.required]],
            date_delivrance: ['', [Validators.required]],
            fk_typecni: ['', [Validators.required]],
            matricule: [''],
            //wallet_carte: ['', [Validators.required]], 
        });

        /*this.bureauService.getAgenceBureauActive().subscribe({
            next: (res) => {
                if(res['code'] == 200) {
                    console.log(res);
                    this.listBureauActive = res['data'];
                    this.filteredBureau = this.listBureauActive;
                }
                else{
                    this.toastr.error(res['msg'], this.__("global.error"));
                }               
            },
            error: (err) => {}
        });*/

        this.ressourceService.getListType().subscribe({
            next: (res) => {
                if(res['code'] == 200) {
                    this.listtypecarte = res['data'];
                }
                else{
                    this.toastr.error(res['msg'], this.__("global.error"));
                }               
            }
            , error: (err) => {}
        });
    }

    /**PHONE INTL */
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

    onSubmit() {
        if (this.beneficiareForm.valid) {
            
            let msg = this.__("global.enregistrer_donnee_?");
            let msg_btn = this.__("global.oui_enregistrer");

            this.beneficiaireSelected = {
                ...this.beneficiaireSelected,
                ...this.beneficiareForm.value
            };
            this.beneficiaireSelected.telephone = "00"+ this.dialCode + this.beneficiaireSelected.telephone;
            this.beneficiaireSelected.date_nais = this.datePipe.transform(this.beneficiaireSelected.date_nais, 'yyyy-MM-dd');
            this.beneficiaireSelected.date_delivrance = this.datePipe.transform(this.beneficiaireSelected.date_delivrance, 'yyyy-MM-dd');

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
                    this.loading = true;
                    this.beneficiaireService.addNewBeneficiaire(this.beneficiaireSelected).subscribe({
                        next: (res) => {
                            if(res['code'] == 201) {
                                this.toastr.success(res['msg'], this.__("global.success"));
                                this.beneficiareForm.reset();
                                this.router.navigate(['gestion_compte/beneficiaire']);
                            }
                            else {
                                let dataMessage = "";
                                if (res['data']['email'] != undefined) {
                                    dataMessage += "- <b>" + res['data']['email'][0] + "</b><br/>";
                                }
                                if (res['data']['telephone'] != undefined) {
                                    dataMessage += "- <b>" + res['data']['telephone'][0] + "</b><br/>";
                                }
                                if (res['data']['dateNaissance'] != undefined) {
                                    dataMessage += "- <b>" + res['data']['dateNaissance'][0] + "</b><br/>";
                                }
                                this.toastr.error(dataMessage, this.__("global.error"),{enableHtml : true});
                            }   
                            this.loading = false;
                        },
                        error: (err) => {
                            this.loading = false;
                        }
                    }); 
                }          
            });

        } else {
            this.toastr.error(this.__("global.form_required"));
        }
    }

}
