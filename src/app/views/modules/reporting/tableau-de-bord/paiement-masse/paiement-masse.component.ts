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
  titlePdf: string;
  listShow: any = false;

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
      this.listShow = true;

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



      let date_debut_fr = this.datePipe.transform(this.dateDebut, 'dd-MM-yyyy');
      let date_fin_fr = this.datePipe.transform(this.dateFin, 'dd-MM-yyyy');


      let title = this.__("dashboard.title_paiement_masse") + ' ';

    
      const mapTypeCompte: { [key: string]: string } = { '0': this.__("global.wallet"), '1': this.__("global.carte"),};
      title += mapTypeCompte[this.typeCompte] || '';
      title += (date_debut_fr != null ? " " + this.__("suivi_compte.from") + ' ' + date_debut_fr + ' ' : '');       
      title += (date_fin_fr != null ? " " + this.__("suivi_compte.to") + ' ' + date_fin_fr + ' ' : ''); 
      
      this.titlePdf = title;
      
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
        file.save(this.titlePdf+".pdf", { returnPromise: true }).then(() => {
          const titleRef = document.getElementById('titleEdt');
          if (titleRef) titleRef.remove(); // ou style.display = 'none';
        });
      }
    });
  }
  


}
