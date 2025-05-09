import { formatDate } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { HttpService } from 'app/services/http.service';
import { PassageService } from 'app/services/table/passage.service';
import { Auth } from 'app/shared/models/db';
import { environment } from 'environments/environment';
import { Toast, ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Translatable } from 'shared/constants/Translatable';

@Component({
  selector: 'app-suivi-compte-principal',
  templateUrl: './suivi-compte-principal.component.html',
  styleUrls: ['./suivi-compte-principal.component.scss']
})
export class SuiviComptePrincipalComponent extends Translatable implements OnInit {

    endpoint = "";

    typeCompte: string = "0";
    dateDebut: string;
    dateFin: string;

    rows: any[] = [];
    currentPage = 1;
    lastPage = 1;
    total = 0;
    solde: String = "0";
    soldeCarte: String = "0";

    loadingData = false;

    //UserStorage
    userStorage: Auth;

    constructor(private passageService: PassageService,private httpService : HttpService,private toastService : ToastrService) {
        super();
    }

    ngOnInit(): void {
        this.passageService.appelURL(null);
        this.endpoint = environment.suivi_compte;
        this.getDataSuivi(this.currentPage);
    }

    getDataSuivi(page: number)
    {
        const dateDebutFormatted = this.dateDebut
            ? formatDate(this.dateDebut, 'yyyy-MM-dd', 'en-US')
            : undefined;

        const dateFinFormatted = this.dateFin
            ? formatDate(this.dateFin, 'yyyy-MM-dd', 'en-US')
            : undefined;

        let url = `${this.endpoint}?page=${page}&__order__=desc,date_transaction`;
        if (dateDebutFormatted) url += `&date_debut=${dateDebutFormatted}`;
        if (dateFinFormatted) url += `&date_fin=${dateFinFormatted}`;
        if (this.typeCompte != "0") url += `&where=releve_des_comptes.wallet_carte|e|${this.typeCompte}`;
        this.loadingData = true;

        this.httpService.get(url).subscribe({
            next: (res) => {
                this.loadingData = false;
                if(res['code'] == 200) {
                    const resultData = res['data'];
                    this.rows = resultData.data;
                    this.currentPage = resultData.current_page;
                    this.lastPage = resultData.last_page;
                    this.total = resultData.total;
                    this.solde = resultData.solde;
                    this.soldeCarte = resultData.solde_carte;
                }else{
                    this.toastService.error(res['msg'] , this.__("global.error"));
                }
            },
            error: (err) => {
                this.loadingData = false;
                this.toastService.error(this.__("global.error"), this.__("global.error"));
            }
        });
    }

    nextPage() {
        if (this.currentPage < this.lastPage) {
            this.getDataSuivi(this.currentPage+= 1);
        }
    }
    
    prevPage() {
        if (this.currentPage > 1) {
          this.getDataSuivi(this.currentPage - 1);
        }
    }

    fitlerSuivi()
    {
        this.currentPage = 1;
        this.getDataSuivi(this.currentPage);
    }

}
