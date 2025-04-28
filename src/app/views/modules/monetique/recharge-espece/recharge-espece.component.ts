import { Component, OnInit } from '@angular/core';
import { CountryISO } from 'ngx-intl-tel-input';
import { Translatable } from 'shared/constants/Translatable';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recharge-espece',
  templateUrl: './recharge-espece.component.html',
  styleUrls: ['./recharge-espece.component.scss']
})
export class RechargeEspeceComponent extends Translatable implements OnInit {

    currentStep = 1;
    codeConfirmation = '';
    montantRecharge = 0;
    fraisType : String = "";

    /**INPUT PHONE */
    telephone: any;
    objetPhone : any;
    element : any;
    currenCode :string ="mg";
    tel!: string;
    preferredCountries: CountryISO[] = [CountryISO.Madagascar];
    /**INPUT PHONE */

    constructor() {
        super();
    }

    ngOnInit(): void {
    }

    confirmerPaiement(): void {
        if (this.codeConfirmation.trim().length === 6) {
        // Ici tu pourrais envoyer le code au backend
        this.goToStep(4);
        } else {
        alert("Veuillez entrer un code de 6 chiffres.");
        }
    }

    /*
    * Phone number functions
    */
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
    /*
    * Phone number functions
    */

    goToStep(step: number): void {
        this.currentStep = step;
    }

    confirmPaiement()
    {
        Swal.fire({
            title: 'Confirmation',
            text: 'Voulez vous recharger ce compte d\'un montant de '+this.montantRecharge+' ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Oui',
            cancelButtonText: 'Annuler',
            customClass: {
                confirmButton: 'swal-button--confirm-custom',
                cancelButton: 'swal-button--cancel-custom'
            },
            allowOutsideClick: false,
            }).then((result) => {
            if (result.isConfirmed) {
                this.goToStep(3);
            }
        });
    }

}
