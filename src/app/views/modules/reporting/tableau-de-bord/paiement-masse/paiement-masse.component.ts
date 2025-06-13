import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Translatable } from 'shared/constants/Translatable';
import formatNumber from 'number-handler'
import { jsPDF } from "jspdf";

@Component({
  selector: 'app-paiement-masse',
  templateUrl: './paiement-masse.component.html',
  styleUrls: ['./paiement-masse.component.scss']
})
export class PaiementMasseComponent extends Translatable implements OnInit {

  formatNumber : any = formatNumber;
  typeCompte: string = "";
  dateDebut: string = "" //new Date().toISOString().substring(0, 10);
  dateFin: string = ""//new Date().toISOString().substring(0, 10);
  walletCarteProfil : string = "";
  data: any = [];

  constructor(
    private datePipe: DatePipe,  
    private toastr: ToastrService,                
    private authService : AuthService


) {
    super();
   }

  ngOnInit(): void {
  }

 async  filtreTableau()
  {
      let filtre_search = "" ; 
      if(this.typeCompte != '2'){
          filtre_search = "&wallet_carte="+this.typeCompte;
      }

      let date_debut = this.datePipe.transform(this.dateDebut, 'yyyy-MM-dd');
      let date_fin = this.datePipe.transform(this.dateFin, 'yyyy-MM-dd');
    
      let filtreDate = "" ;
      if(date_debut && date_fin){
          if( date_debut > date_fin ){
            this.toastr.warning(this.__('msg.dateDebut_dateFin_error'),this.__("msg.warning"));
            return;
          }else{
            filtreDate = "?date_debut="+date_debut +"&date_fin="+date_fin;
          }
      }
      
      let filtreParMulti =  filtreDate + filtre_search;
      let result = await this.authService.getSelectList(environment.etatCommissionPM +  filtreParMulti,[]);

      this.data.paiement_masse_societe = result.paiement_masse_societe
      this.data.paiement_masse_etat = result.paiement_masse_etat
      this.data.recap = result.recp_global
  }

  async exportPdf() {


    console.log("ssss");
    
    this.authService.exportPdf(this.print(this.data),"title").then(
      (response: any)=>{},
      (error:any)=>{
        console.log(error)
      }
    );
  }

  print(dataFacture:any){


    let tabfacturation_HPM = dataFacture.facturation_HPM.map((facturation_HPM: any, index: number) => {
      let t: any = {};
        t[this.__('dashboard.nom_service')] = facturation_HPM.label;
        t[this.__('dashboard.nb_transaction')] = facturation_HPM.nb;
        t[this.__('dashboard.montant')] = facturation_HPM.mt_total;
        t[this.__('dashboard.frais')] = facturation_HPM.com_ht_total;
        t[this.__('dashboard.taxe')] = facturation_HPM.tva_total;
        t[this.__('dashboard.frais_ttc')] = facturation_HPM.com_ttc_total;
        t[this.__('dashboard.part_paoma')] = facturation_HPM.poste_total;
        t[this.__('dashboard.part_num')] = facturation_HPM.numherit_total;
              
      return t;
    });

    let tabfacturation_SNP = dataFacture.facturation_SUNUPAY.map((facturation_SUNUPAY: any, index: number) => {
      let t: any = {};
        t[this.__('dashboard.nom_service')] = facturation_SUNUPAY.label;
        t[this.__('dashboard.nb_transaction')] = facturation_SUNUPAY.nb;
        t[this.__('dashboard.montant')] = facturation_SUNUPAY.mt_total;
        t[this.__('dashboard.frais')] = facturation_SUNUPAY.com_ht_total;
        t[this.__('dashboard.taxe')] = facturation_SUNUPAY.tva_total;
        t[this.__('dashboard.frais_ttc')] = facturation_SUNUPAY.com_ttc_total;
        t[this.__('dashboard.part_paoma')] = facturation_SUNUPAY.poste_total;
        t[this.__('dashboard.part_num')] = facturation_SUNUPAY.numherit_total;
              
      return t;
    });

    let tabrecap: any[] = [];     
    
    tabrecap.push({
      [this.__('dashboard.nom_service')] : dataFacture.recapitulatif_global.label,
      [this.__('dashboard.nb_transaction')] : dataFacture.recapitulatif_global.nb,
      [this.__('dashboard.montant')] : dataFacture.recapitulatif_global.mt_total,
      [this.__('dashboard.frais')] : dataFacture.recapitulatif_global.com_ht_total,
      [this.__('dashboard.taxe')] : dataFacture.recapitulatif_global.tva_total,
      [this.__('dashboard.frais_ttc')] : dataFacture.recapitulatif_global.com_ttc_total,
      [this.__('dashboard.part_paoma')] : dataFacture.recapitulatif_global.poste_total,
      [this.__('dashboard.part_num')] : dataFacture.recapitulatif_global.numherit_total
    });

    let tab: any[] = [];

    // Ligne titre pour HPM
    tab.push({ 
      
      [this.__('dashboard.nom_service')] : '',
      [this.__('dashboard.nb_transaction')] : '',
      [this.__('dashboard.montant')] : '',
      [this.__('dashboard.frais')] : this.__('dashboard.nom_service'),
      [this.__('dashboard.taxe')] : this.__('dashboard.facturation_HPM'),
      [this.__('dashboard.frais_ttc')] : '',
      [this.__('dashboard.part_paoma')] : '',
      [this.__('dashboard.part_num')] : ''

    });
    tab.push(...tabfacturation_HPM);

    // Ligne titre pour SNP
    tab.push({ 
      
      [this.__('dashboard.nom_service')] : '',
      [this.__('dashboard.nb_transaction')] : '',
      [this.__('dashboard.montant')] : '',
      [this.__('dashboard.frais')] : this.__('dashboard.nom_service'),
      [this.__('dashboard.taxe')] : this.__('dashboard.facturation_SNP'),
      [this.__('dashboard.frais_ttc')] : '',
      [this.__('dashboard.part_paoma')] : '',
      [this.__('dashboard.part_num')] : ''

    });

    tab.push(...tabfacturation_SNP);

    // Ligne titre pour le récapitulatif
    tab.push({ 
      
      [this.__('dashboard.nom_service')] : '',
      [this.__('dashboard.nb_transaction')] : '',
      [this.__('dashboard.montant')] : '',
      [this.__('dashboard.frais')] : this.__('dashboard.nom_service'),
      [this.__('dashboard.taxe')] : this.__('dashboard.recap_global'),
      [this.__('dashboard.frais_ttc')] : '',
      [this.__('dashboard.part_paoma')] : '',
      [this.__('dashboard.part_num')] : ''

    });

    tab.push(...tabrecap);

 

    

    return tab;

  }


  exportEdtToPdf() {
    const content = document.getElementById("content");
    if (!content) {
      console.error("Élément #content introuvable !");
      return;
    }
  
    // Ajouter le titre AVANT pdf.html()
    const titleHTML = `
      <div id='titleEdt' 
           style='margin: 10px; margin-left:30px; background-color: #44A1A0; 
                  text-align: center; color: white; font-size: 20px;'>
        BULLETIN <span style='margin: 0 10px'>SEMESTRIEL</span>
      </div>
    `;
    const scheduleRef = document.getElementById("scheduleRef");
    if (scheduleRef) {
      scheduleRef.insertAdjacentHTML("beforebegin", titleHTML);
    }
  
    content.style.width = '1500px';
  
    const pdf = new jsPDF('landscape', 'mm', [1530, 1000]);
  
    pdf.html(content, {
      callback: (file) => {
        file.save("facture.pdf", { returnPromise: true }).then(() => {
          const titleRef = document.getElementById('titleEdt');
          if (titleRef) titleRef.remove(); // ou style.display = 'none';
        });
      }
    });
  }
  


}
