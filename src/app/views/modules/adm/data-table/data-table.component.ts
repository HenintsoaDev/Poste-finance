import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MenuService } from 'app/shared/models/route-info';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { map, startWith, Subject, takeUntil } from 'rxjs';
import { Translatable } from 'shared/constants/Translatable';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent extends Translatable implements OnInit {

    userForm: FormGroup;
    ministereSelectionne: number;
    separateDialCode = false;
	  SearchCountryField = SearchCountryField;
	  CountryISO = CountryISO;
    PhoneNumberFormat = PhoneNumberFormat;
	  preferredCountries: CountryISO[] = [CountryISO.Madagascar];
    //selectedCountryISO = CountryISO.Madagascar;
    phoneForm = new FormGroup({
        phone: new FormControl(undefined, [Validators.required])
    });
    selectSearch = new FormControl();

    selectedCountryISO = 'mg';
    phoneNumber = '';

  /**SEARCH INPUT */
  options: string[] = ['Apple', 'Banana', 'Orange', 'Mango', 'Pineapple'];
  filteredOptions: string[] = [...this.options];
  searchCtrl = new FormControl();
  selectedValue: string = '';

  /**INPUT PHONE */
  telephone: any;
  objetPhone : any;
  element : any;
  currenCode :string ="mg";
  tel!: string;
  /**INPUT PHONE */

/***************************************** */
endpoint = "";
header = [
  {
    "nomColonne" : "Matricule",
    "colonneTable" : "code_nin2",
    "table" : "etudiant"
  },
  {
    "nomColonne" : "Nom",
    "colonneTable" : "nom",
    "table" : "etudiant"
  },
  {
    "nomColonne" : "Prenom",
    "colonneTable" : "prenom",
    "table" : "etudiant"
  },
  {
    "nomColonne" : "Date de naissance",
    "colonneTable" : "date_naissance",
    "table" : "etudiant"
  },
  {
    "nomColonne" : "CIN",
    "colonneTable" : "cin_passeport",
    "table" : "etudiant"
  },
  {
    "nomColonne" : "Date delivrance",
    "colonneTable" : "date_livrance",
    "table" : "etudiant"
  },
  {
    "nomColonne" : "Mention",
    "colonneTable" : "name",
    "table" : "mention"
  },
  {
    "nomColonne" : "Niveau",
    "colonneTable" : "name",
    "table" : "niveau"
  },
 
  
 
]

objetBody = [
        {
          'name' : 'code_nin2',
          'type' : 'text',
        },
        {
          'name' : 'nom',
          'type' : 'text',
        },
        {
          'name' : 'prenom',
          'type' : 'text',
        },
        {
          'name' : 'date_naissance',
          'type' : 'date',
        },
        {
          'name' : 'cin_passeport',
          'type' : 'text',
        },
        {
          'name' : 'date_livrance',
          'type' : 'date',
        },
        {
          'name' : 'mention',
          'type' : 'text',
        },
        {
          'name' : 'niveau',
          'type' : 'text',
        },
]
listIcon = []

searchGlobal = ['etudiant.code_nin2', 'etudiant.nom', 'etudiant.prenom', 'etudiant.date_naissance', 'etudiant.cin_passeport', 'etudiant.date_livrance', 'mention.name', 'niveau.name']
@ViewChild('saisirCIN') saisirCIN: TemplateRef<any> | undefined;
/***************************************** */

    
    constructor(private fb: FormBuilder,private menuService: MenuService) {
        super();
        this.userForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            ministere: ['', Validators.required],
            dateFonction: ['', Validators.required],
            phone: ['', Validators.required]
        });
    }

    private _onDestroy = new Subject<void>();

    ngOnInit(): void {
      this.searchCtrl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value)),
        takeUntil(this._onDestroy)
      )
      .subscribe(filtered => {
        this.filteredOptions = filtered;
      });
    }

    private _filter(value: string): string[] {
    const filterValue = value ? value.toLowerCase() : '';
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

    onConfirm() {
        console.log("Action confirmée !");
    }

    onSubmit() {
        if (this.userForm.valid) {
        //console.log("Données du formulaire :", this.userForm.value);
            alert("Utilisateur ajouté avec succès !");
        } else {
            alert("Veuillez remplir tous les champs correctement.");
        }
    }


  changePreferredCountries() {
    this.preferredCountries = [CountryISO.India, CountryISO.Canada];
  }


  telInputObject(m:any){
    this.objetPhone = m.s
  }

  onCountryChange(m:any){}

  controle(element:any){}

  hasError: boolean = false;
  onError(obj : any) {
      this.hasError = obj;
  }

  getNumber(obj : any) {
    this.telephone = obj;
  }

  /**Filtred search */
  filterOptions() {
    this.filteredOptions = this.options.filter(option =>
      option.toLowerCase().includes(this.selectedValue.toLowerCase())
    );
  }
  

}
