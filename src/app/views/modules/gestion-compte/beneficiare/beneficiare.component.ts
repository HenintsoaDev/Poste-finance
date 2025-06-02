import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BureauService } from 'app/services/admin/gestion-bureau/bureau.service';
import { RessourceService } from 'app/services/ressource.service';
import { environment } from 'environments/environment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Translatable } from 'shared/constants/Translatable';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { PassageService } from 'app/services/table/passage.service';
import { FormBuilder, FormControl, FormGroup,Validators } from '@angular/forms';
import { BeneficiaireService } from 'app/services/gestion-compte/beneficiaire.service';
import Swal from 'sweetalert2';
import { bureau } from '../../../../shared/models/db';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-beneficiare',
  templateUrl: './beneficiare.component.html',
  styleUrls: ['./beneficiare.component.scss']
})
export class BeneficiareComponent extends Translatable implements OnInit {

    @ViewChild('modalBeneficiaire') modalBeneficiaire: TemplateRef<any> | undefined; 
    @ViewChild('detailBeneficiaire') detailBeneficiaire: TemplateRef<any> | undefined;
    
    endpoint = "";
    header = [
        { "nomColonne": this.__('global.name'), "colonneTable": "nom", "table": "beneficiaire" },
        {"nomColonne" :  this.__('global.lastname'),"colonneTable" : "prenom","table" : "beneficiaire"},
        {"nomColonne" :  this.__('utilisateur.email'),"colonneTable" : "email","table" : "beneficiaire"},
        {"nomColonne" :  this.__('utilisateur.adresse'),"colonneTable" : "adresse","table" : "beneficiaire"},
        {"nomColonne" : this.__('suivi_compte.type_compte'), "colonneTable": "wallet_carte", "table": "beneficiaire" },
        {"nomColonne" :  this.__('global.date_creation'),"colonneTable" : "date_creation","table" : "beneficiaire"},
        {"nomColonne" :  this.__('global.agence'),"colonneTable" : "agence","table" : "beneficiaire"},
        {"nomColonne" :  this.__('global.statut'),"colonneTable" : "state_value","table" : "beneficiaire"},
        {"nomColonne" : this.__('global.action')}
    ];

    objetBody = [
        { 'name': 'nom', 'type': 'text', },
        {'name' : 'prenom','type' : 'text',},
        {'name' : 'email','type' : 'text',},
        {'name' : 'adresse','type' : 'montant',},
        { 'name': 'wallet_carte', 'type': 'text', },
        {'name' : 'date_creation','type' : 'text',},
        {'name' : 'agence','type' : 'text',},
        {'name' : 'state_value','type' : 'montant',},
        {'name' : 'rowid',},
    ];

    listIcon = [
        {'icon' : 'info','action' : 'info','tooltip' : this.__('global.tooltip_detail'),'autority' : '',},
        {'icon' : 'edit','action' : 'edit','tooltip' : this.__('global.tooltip_edit'),'autority' : '',},
    ];

    idBeneficiaire: any;
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
    user_creation: string;
    date_creation: string;

    beneficiareForm: FormGroup;

    searchGlobal = ['beneficiaire.nom', 'beneficiaire.prenom', 'beneficiaire.email', 'beneficiaire.adresse'];

    subscription: Subscription;

    titleModal : string = "";
    modalRef?: BsModalRef;

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

    //Bureau agence
    listBureauActive = [];
    filteredBureau = [];
    searchControl = new FormControl('');

    listtypecarte = [];

    listBeneficiaire = [];

    typeCompte: string = "2";
    dateDebut: string = "" //new Date().toISOString().substring(0, 10);
    dateFin: string = ""//new Date().toISOString().substring(0, 10);
    bureauFiltred: any;
    agenceSearchData: any;
    filteredBureauSearchData = [];
    searchControlFiltredBureau = new FormControl('');

    loading : boolean = false;
    
    constructor(
        private fb: FormBuilder, 
        private ressourceService: RessourceService,
        private modalService: BsModalService,
        private bureauService: BureauService,
        private passageService: PassageService,
        private toastr: ToastrService,
        private datePipe: DatePipe,
        private beneficiaireService : BeneficiaireService
    ) {
        super();
    }

    ngOnInit(): void {
        this.endpoint = environment.baseUrl + '/' + environment.beneficiaire;
        this.passageService.appelURL(null);

        this.beneficiareForm = this.fb.group({
            nom: ['', Validators.required],
            prenom: [''],
            adresse: ['', [Validators.required]],
            email: ['', [Validators.required]],
            //telephone: ['', [Validators.required,  Validators.minLength(9), Validators.maxLength(9)]],
            //agence: ['', [Validators.required]],
            cni: ['', [Validators.required]], 
            sexe: ['', [Validators.required]],
            date_nais: ['', [Validators.required]],
            date_delivrance: ['', [Validators.required]],
            fk_typecni: ['', [Validators.required]],
        });

        this.subscription = this.passageService.getObservable().subscribe(event => {
  
            if( event.data){
                this.idBeneficiaire = event.data.id;
  
                if (event.data.action == 'edit') {
                    this.openModalBeneficiare();
                } else if (event.data.action == 'info') {
                    this.openModalDetailBeneficiare();
                }
                this.passageService.clear();  // ==> à implémenter dans ton service
            }
        });

        this.bureauService.getAgenceBureauActive().subscribe({
            next: (res) => {
                if(res['code'] == 200) {
                    console.log(res);
                    this.listBureauActive = res['data'];
                    this.filteredBureau = this.listBureauActive;
                    this.filteredBureauSearchData = this.listBureauActive;
                }
                else{
                    this.toastr.error(res['msg'], this.__("global.error"));
                }               
            },
            error: (err) => {}
        });

        this.searchControl.valueChanges.subscribe(value => {
            const lower = value?.toLowerCase() || '';
            this.filteredBureau = this.listBureauActive.filter(bureau =>
                bureau.name.toLowerCase().includes(lower)
            );
        });

        this.searchControlFiltredBureau.valueChanges.subscribe(value => {
            const lower = value?.toLowerCase() || '';
            this.filteredBureauSearchData = this.listBureauActive.filter(bureau =>
                bureau.name.toLowerCase().includes(lower)
            );
        });

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

    filtreTableau()
    {
        let filtre_search = "" ; 
        if(this.typeCompte != '2'){
            filtre_search = ",beneficiaire.wallet_carte|e|"+this.typeCompte;
        }

        let filtre_bureau = "" ;
        if(this.agenceSearchData != undefined && this.agenceSearchData != "-1"){
            filtre_bureau = ",beneficiaire.fk_agence|e|"+this.agenceSearchData;
        }

        let date_debut = this.datePipe.transform(this.dateDebut, 'yyyy-MM-dd');
        let date_fin = this.datePipe.transform(this.dateFin, 'yyyy-MM-dd');
      
        let filtreDate = "" ;
        if(date_debut && date_fin){
            if( date_debut > date_fin ){
                this.toastr.warning(this.__('msg.dateDebut_dateFin_error'),this.__("msg.warning"));
                return;
            }else{
                filtreDate = "&date_debut="+date_debut +"&date_fin="+date_fin;
            }
        }
        
        let filtreParMulti =  filtre_search + filtre_bureau + filtreDate + "&_order_=desc,date_creation";
        this.passageService.appelURL(filtreParMulti);
    }

    ngOnDestroy() {
        if (this.subscription) {
          this.subscription.unsubscribe();
        }
    }

    recupererDonnee(){

        // Récupérer la liste affichée dans le tableau depuis le localStorage.
        const storedData = localStorage.getItem('data');
        let result : any;
        if (storedData) result = JSON.parse(storedData);
        this.listBeneficiaire = result.data;
  
        // Filtrer le tableau par rapport à l'ID et afficher le résultat dans le formulaire.
        let res = this.listBeneficiaire.filter(_ => _.rowid == this.idBeneficiaire);
        if(res.length != 0){
            let beneficiaireSelected = res[0];
            this.beneficiaireSelected = beneficiaireSelected;
            this.nom = beneficiaireSelected.nom;
            this.prenom = beneficiaireSelected.prenom;
            this.email = beneficiaireSelected.email;
            this.adresse = beneficiaireSelected.adresse;
            this.wallet_carte = beneficiaireSelected.wallet_carte;
            this.date_nais = beneficiaireSelected.date_nais;
            this.agence = beneficiaireSelected.fk_agence;
            this.bureauLabel = this.listBureauActive.find(bureau => bureau.rowid === beneficiaireSelected.fk_agence)?.name || '';
            this.telephone = beneficiaireSelected.telephone;
            this.state_value = beneficiaireSelected.state_value;
            this.rowid = beneficiaireSelected.rowid;
            this.sexe = beneficiaireSelected.sexe;
            this.cni = beneficiaireSelected.cni;
            this.matricule = beneficiaireSelected.matricule;
            this.date_delivrance = beneficiaireSelected.date_delivrance;
            this.fk_typecni = beneficiaireSelected.fk_typecni;
            this.type_carte = beneficiaireSelected.type_carte ? beneficiaireSelected.type_carte : 0;
            this.user_creation = beneficiaireSelected.user_creation;
            this.date_creation = beneficiaireSelected.date_creation;
            /*this.telephone = beneficiaireSelected.telephone;
            this.objetPhone = beneficiaireSelected.telephone;
            this.element = beneficiaireSelected;*/
          
        }
    }

    openModalBeneficiare()
    {
        this.recupererDonnee();

        if (this.modalRef) {
            this.modalRef.hide();
        }

        this.titleModal = this.__('beneficiaire.update_beneficiaire');
        this.modalRef = this.modalService.show(this.modalBeneficiaire, {
            backdrop: 'static',
            keyboard: false,
            class: 'modal-lg'
        });
    }

    openModalDetailBeneficiare()
    {
        this.recupererDonnee();

        if (this.modalRef) {
            this.modalRef.hide();
        }

        this.titleModal = this.__('beneficiaire.detail_beneficiaire');
        this.modalRef = this.modalService.show(this.detailBeneficiaire, {
            backdrop: 'static',
            keyboard: false,
            class: 'modal-lg'
        });
    }

    onSubmit() {
        if (this.beneficiareForm.valid) {
            this.beneficiaireSelected = {
                ...this.beneficiaireSelected,
                ...this.beneficiareForm.value
            };
            delete this.beneficiaireSelected.wallet_carte; // On ne modifie pas le rowid

            let msg = this.__("global.modifier_donnee_?");
            let msg_btn = this.__("global.oui_modifier");

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
                    this.beneficiaireService.updateBeneficiaire(this.beneficiaireSelected).subscribe({
                        next: (res) => {
                            if(res['code'] == 201) {
                                this.toastr.success(res['msg'], this.__("global.success"));
                                this.actualisationTableau();
                                this.closeModal();
                            }
                            else{
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
        }else {
            this.toastr.error(this.__("global.form_required"));
        }
    }

    // Actualisation des données
    actualisationTableau(){
        this.passageService.appelURL('');
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

    closeModal() {
        this.modalRef?.hide();
    }

}
