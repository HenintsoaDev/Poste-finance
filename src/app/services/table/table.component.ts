import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
//import { valuesys } from '../../../../../../options';
import { PassageService } from './passage.service';
import formatNumber from 'number-handler'
import { Subscription } from 'rxjs';
import { valuesys } from 'app/shared/models/options';
import { Translatable } from 'shared/constants/Translatable';
import { AuthService } from '../auth.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent extends Translatable {
    formatNumber : any = formatNumber;

        //--paginate
    public paginateListe: any = [];
    public nextPage: any = [];
    public prevPage: any = [];
    public lastPage: any = [];
    public firstPage: any = [];
    public currentPage: any = [];
    public total: any = [];
    public path: any = [];
    public lastNumPage: any = [];
    public infoData: any = [];
    public cPage_less_2!: number;
    public path_cPage_less_2: any;
    public cPage_less_1!: number;
    public path_cPage_less_1: any;
    public cPage_more_1!: number;
    public path_cPage_more_1: any;
    public cPage_more_2!: number;
    public path_cPage_more_2: any;
    //--end-paginate

    searchInput: any = "";
    filtreSelect: any = 10;
    searchColumn: any = "";
    column: string = "";
    childCol: any;
    search: string = "";
    searchCol: string = "";
    tri: any = "";
    order: any = "";
    where: any = "&where=1|e|1";


    @Input() endpoint : any;
    @Input() headerTable : any;
    @Input() body : any;
    @Input() listIcon : any;
    @Input() searchGlobal : any;
    @Input() formSearch: any = true;
    @Input() triDescDefault: any = '';


    resData : any;
    donneeAfficher: any[] = [];
    isLoading: boolean = false;
    donneeTotal: any = [];


    constructor(             
      private http: HttpClient,
      private passageService: PassageService,
      private datePipe: DatePipe,
      private authService : AuthService


      ) { 
        super();
        this.authService.initAutority("PRM","ADM");
    }

    subscription: Subscription;

    async ngOnInit() {


      this.subscription = this.passageService.getObservable().subscribe(event => {
        if (!event || typeof event !== 'object') return;
      
        const { type, data: filtre } = event;

        console.log("xx--evenement--xx",event);
        console.log("xx--evenement--xx",this.endpoint);
      
        // Vérifie si c'est un événement pertinent
        if ((type === 'url' || type === '') && this.endpoint) {
          const url = `${this.endpoint}?page=1`;
          console.log("xx--ato?--xx",event);

          if (filtre) {
            console.log("xx--filtre ok?--xx",event);

            // Appliquer un filtre s’il existe
            this.getUrlDatatable(url, '', '', '', filtre);
          } else {
            console.log("xx--filtre non ok?--xx",event);

            // Sinon appliquer un tri ou appeler l'URL brute
            if (this.triDescDefault) this.triTable(this.triDescDefault, 'desc');
            else this.getUrlDatatable(url);
            
          }

        }
      });

      
    }

    ngOnDestroy() {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    }



    /*
    ** @Param du fonction:
    ** col : nom de colonne,
    ** order : triage (asc ou desc)
    */
    async triTable(col: any, order: any){

      console.log("eeeee");
      this.tri = col; this.order = order;
      this.getUrlDatatable(this.endpoint +"?page=1" ,'', '', '', this.search)

    }

    /*
    ** Filtre des nombre des données du tableau
    */
    async getFiltreSelect(){
      this.getUrlDatatable(this.endpoint +"?page=1", '', '', '', this.search)
    }

    /*
    ** Recherche global par formulaire
    */
    async getSearchInput(){
      this.getUrlDatatable(this.endpoint +"?page=1")
    }

    /*
    ** @Param du fonction:
    ** url : endpoint,
    ** col : nom du colonne qu'on doit faire le recherche
    ** refElement : reference du formulaire qu'on doit recuperer le valeur
    ** searchMulti : filtre par plusieur formulaire ou
    */
    async getUrlDatatable(
      url: any = "",
      colonne = "",
      refElement?: any,
      table?: any,
      searchMulti?: any
    ) {

      this.isLoading = true;
    
      this.search = "";
      this.searchCol = "";
      if(searchMulti != '' && searchMulti != undefined){
        this.search = searchMulti;
        this.searchCol = "";
      }

          //** recherche par colonne */
          if (colonne != "" && refElement ) {
            if (refElement != "" && refElement != "undefined") {
              this.searchCol = "," + table + "." + colonne + "|l|" + refElement;
            } else if (refElement == "") {
              this.searchCol = "";
            }
          }
          
            //** recherche global par formulaire */
          if (this.searchInput != "" && this.searchInput != "undefined") {
              
              let searchGlobal = "";
              let sep = "";

              for (let i = 0; i < this.searchGlobal.length; i++) {
                //**  element : table.nom_de_colonne */
                const element = this.searchGlobal[i];

                //**  ,table.nom_colonne|l|*/
                searchGlobal += sep + element + "|l|%" + this.searchInput + "%" ;
                sep = ",";
              }
              this.searchCol = "&where_or=" + searchGlobal;

            }

      


      //** filtre de nombre d'affichage */
      let filtre: any = "";
      if (this.filtreSelect != "" && this.filtreSelect != "undefined") {
        filtre = "&per_page=" + this.filtreSelect;
      }

      //** triage par ascendant ou descendant */
      let triage: any = "";
      if (this.tri != "" && this.tri != "undefined") {
        triage = "&__order__=" + this.order + "," + this.tri;
      }

      //initialisation 
      this.donneeTotal.Carte = undefined;
      this.donneeTotal.Wallet = undefined;
      this.donneeTotal.DEBIT = undefined;
      this.donneeTotal.CREDIT = undefined;
      this.donneeTotal.TotalSolde = undefined;
      this.donneeTotal.TotalSoldeCarte = undefined;

    // --- Appel endpopint ---->

      let toogle = await this.http.get<any>(url + this.where + this.searchCol + this.search    + filtre + triage  ,valuesys.httpAuthOptions()).toPromise();
      let res = toogle.data;
      this.isLoading = false;
      
      await localStorage.setItem('data', JSON.stringify(res));

       /** SET SOLDE (SUIVI COMPTE) in localstorage*/
       if(res.solde){await localStorage.setItem(environment.soldeSuiviCompte, res.solde);} 
       if(res.solde_carte) {await localStorage.setItem(environment.soldeCarteSuiviCompte, res.solde_carte);} 
       /** SET SOLDE CP (HISTORIQUE VIREMENT) in localstorage*/
       if(res.solde_cp) {await localStorage.setItem(environment.soldeVirementCp, res.solde_cp);}
       if(res.solde_carte_cp) {await localStorage.setItem(environment.soldeVirementCarteCp, res.solde_carte_cp);}
       /** SET SOLDE TOTAL (SOLDE DES BUREAUX) in localstorage*/
       if(res.solde_global?.total_solde) { await localStorage.setItem(environment.soldeGlobalTotalSolde, res.solde_global.total_solde); }
       if(res.solde_global?.total_solde_carte) { await localStorage.setItem(environment.soldeGlobalTotalSoldeCarte, res.solde_global.total_solde_carte); }

      if(res.totaux){
        //this.donneeTotal = res.totaux;
        (res.totaux.Carte) ? this.donneeTotal.Carte = res.totaux.Carte : this.donneeTotal.Carte = undefined;
        (res.totaux.Wallet) ? this.donneeTotal.Wallet = res.totaux.Wallet : this.donneeTotal.Wallet = undefined;

        (res.totaux.DEBIT) ? this.donneeTotal.DEBIT = res.totaux.DEBIT : this.donneeTotal.DEBIT = undefined;
        (res.totaux.CREDIT) ? this.donneeTotal.CREDIT = res.totaux.CREDIT : this.donneeTotal.CREDIT = undefined;
      }

      if(res.solde_global){
        (res.solde_global.total_solde) ? this.donneeTotal.TotalSolde = res.solde_global.total_solde : this.donneeTotal.TotalSolde = undefined;
        (res.solde_global.total_solde_carte) ? this.donneeTotal.TotalSoldeCarte = res.solde_global.total_solde_carte : this.donneeTotal.TotalSoldeCarte = undefined;
      }
      

      let tableau = res.data.map((row: any) =>
        this.body.map((col: any) => {
          if (col.name === "state#id" || col.name === "state#rowid") {
            const targetId = col.name === "state#id" ? row.id : row.rowid;
            
            // 1. Trouver l'icône "home"
            const stateIcon = this.listIcon.find(i => i.icon === 'state');

            // 2. Mapper tous les autres icônes sauf "state"
            const icons = this.listIcon
              .filter(i => i.icon !== 'state')
              .map(i => ({
                icon: i.icon,
                action: i.action,
                tooltip: i.tooltip,
                autority: i.autority,
                id: targetId,
              }));

            // 3. Ajouter un objet via concat, utilisant l'autorité de l'icône "state"
            return icons.concat({
              statut: row.statut,
              state: row.state,
              autority: stateIcon?.autority,
              id: targetId,
            });
          }

         // console.log("colonne",col);
      
          // Si ce n'est pas "state#id" ni "state#rowid"
          return `${row[col.name]}###${col.type}`;
        })
      );
    
      this.donneeAfficher = tableau;

      this.path = this.endpoint;
      this.lastPage = this.path + "?page=" + res.last_page;
      this.currentPage = res.current_page;
      this.firstPage = this.path + "?page=1";

      this.prevPage = this.path + "?page=" + (this.currentPage - 1);
      this.nextPage = this.path + "?page=" + (this.currentPage + 1);
      if (this.lastPage == 0) {
        this.currentPage = 0;
      }

      this.lastNumPage = res.last_page;
      this.total = res.total;


      this.cPage_less_2 = 0;
      this.cPage_less_1 = 0;
      if (this.currentPage > 1) {
        if (this.currentPage > 2) {
          this.cPage_less_2 = this.currentPage - 2;
          this.path_cPage_less_2 = this.path + "?page=" + this.cPage_less_2;
        }

        this.cPage_less_1 = this.currentPage - 1;
        this.path_cPage_less_1 = this.path + "?page=" + this.cPage_less_1;
      }

      this.cPage_more_1 = 0;
      this.cPage_more_2 = 0;
      if (this.currentPage < this.lastNumPage) {
        this.cPage_more_1 = this.currentPage + 1;
        this.path_cPage_more_1 = this.path + "?page=" + this.cPage_more_1;

        if (this.currentPage < this.lastNumPage - 1) {
          this.cPage_more_2 = this.currentPage + 2;
          this.path_cPage_more_2 = this.path + "?page=" + this.cPage_more_2;
        }
      }




      let start = 0;
      let to = 0;
      let total = 0;
      if(res.total== undefined){
        start = 0;  total = 0;  to = 0;
      }
      else {

        if(res.total > res.to) to = res.to;
        else to = res.total;

        start =  res.from;
        total = res.total;

      }


      //** Affichage le nombre des élémens */
      let text = "Affichage de l'élément _START_ à _END_ sur _TOTAL_ éléments";
        let info = text.replace('_START_', start.toString())
        let info2 =info.replace('_END_', to.toString())
        this.infoData = info2.replace('_TOTAL_', total.toString())

    }

    //** verification si l"element est tableau */
    isArray(value: any): boolean {
      return Array.isArray(value);
    }

    // Cette méthode sera appelée lors du clic sur les icônes
    openModal(data: any) {
    // Passer des données à ouvrir dans le modal
      this.passageService.openModal(data);
    }

    formatCell(data){
      let post = data.split('###');


      //** si la donnée est null */
      if(post[0] == "null") return '';

      //** si le type de donnée est date */
      if(post[1] == 'date') return this.datePipe.transform(post[0], 'dd/MM/YYYY HH:mm:ss');
      else if(post[1] == 'montant') return this.formatNumber(post[0], ' ');
      else if(post[1] == 'statut') {
        if(post[0] == 1) return this.__('global.validate');
        else if(post[0] == 0) return this.__('global.en_attente');
        else if(post[0] == 2) return this.__('global.not_valide');
      }
      else return post[0]

    }

    //** Verification pour icon"
    verifIcon(dataIcon){

      if ('state' in dataIcon) {
        return dataIcon.state === 1 ? 'toggle_on' :
               dataIcon.state === 0 ? 'toggle_off' :
               dataIcon.icon ?? '';
      }
      return dataIcon.icon ?? '';

    }

    //** Verification pour survole "tooltip"
    verifTooltipIcon(dataIcon){

      if ('state' in dataIcon) {
        return dataIcon.state === 1 ? this.__('global.clique_pour_desactiver') :
               dataIcon.state === 0 ? this.__('global.clique_pour_activer') :
               dataIcon.tooltip ?? '';
      }
      return dataIcon.tooltip ?? '';

    }
   
    //** Verification pour le couleur de l'icon
    verifColorIcon(dataIcon: any): string {
      
      // Si "state" est présent
      if ('state' in dataIcon) {
        switch (dataIcon.state) {
          case 1: return 'green'; // bleu
          case 0: return 'red'; // orange
          default: return dataIcon.tooltip ?? '';
        }
      }
    
      //** Sinon, selon l'action
      switch (dataIcon.action) {
        case 'delete': return '#ec6a31';
        case 'edit': return '#35558d';
        case 'rejeter': return '#d9534f';
        case 'validation': return '#5cb85c';
        default: return '#35558d';
      }
    }

    verifColorText(dataText: any)  {
      let post = dataText.split('###');

      //** si la donnée est null */
      if(post[0] == "null") return '';

      if(post[1] == 'statut') {
        if(post[0] == 1) return '#5cb85c';
        else if(post[0] == 0) return '#f0ad4e';
        else if(post[0] == 2) return '#d9534f';
      }else return '';



    }

    verifStatut(cell: any)  {
        // Cherche l'objet contenant 'statut'
        const statutItem = cell.find(item => 'statut' in item);
        // Récupère la valeur
        const statut = statutItem ? (statutItem as { statut: number }).statut : undefined;
        return statut;
            
    }


    verifAlignText(dataText: any){
        console.log(dataText)
        let post = dataText.split('###');
  
        console.log("xxxxx", post[1])

        //** si la donnée est null */
        if(post[0] == "null") return '';
  
        if(post[1] == 'montant') return 'text-right';
      
    }



}
