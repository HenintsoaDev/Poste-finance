import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
//import { valuesys } from '../../../../../../options';
import { PassageService } from './passage.service';
import formatNumber from 'number-handler'
import { Subscription } from 'rxjs';
import { valuesys } from 'app/shared/models/options';
import { Translatable } from 'shared/constants/Translatable';

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


    resData : any;
    donneeAfficher: any[] = [];
    isLoading: boolean = false;


    constructor(             
      private http: HttpClient,
      private passageService: PassageService,
      private datePipe: DatePipe

      ) { 
        super();
    }

    subscription: Subscription;

    async ngOnInit() {


      this.subscription = this.passageService.getObservable().subscribe(event => {
        console.log("mijery event ------", event);

        

        if (event.type === 'url' || event.type === '' ) {
          const filtre = event.data;
          const url = `${this.endpoint}?page=1`;
      
          if (!filtre) {
            this.getUrlDatatable(url);
          } else {
            this.getUrlDatatable(url, '', '', '', filtre);
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
      this.tri = col; this.order = order;
      this.getUrlDatatable(this.endpoint +"?page=1")

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

      console.log(searchMulti);
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

      

      console.log(this.searchCol );

      

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

    // --- Appel endpopint ---->

      let toogle = await this.http.get<any>(url + this.where + this.searchCol + this.search    + filtre + triage  ,valuesys.httpAuthOptions()).toPromise();
      let res = toogle.data;
      this.isLoading = false;
      
      localStorage.setItem('data', JSON.stringify(res));

      //** Affichage de donnée dynamiser */
      let tableau = res.data.map((row: any) => 
      this.body.map((col: any) => 
        col.name === "state#id"
          ? this.listIcon.map(i => ({
              icon: i.icon,
              action: i.action,
              tooltip: i.tooltip,
              id: row.id         
            })).concat({ state: row.state, id: row.id  })
          : col.name === "state#rowid"
            ? this.listIcon.map(i => ({
                icon: i.icon,
                action: i.action,
                tooltip: i.tooltip,
                id: row.rowid         
              })).concat({ state: row.state, id: row.rowid  }) 
          : `${row[col.name]}###${col.type}` // Si ce n'est pas "state#id" ou "state#rowid" , concaténer
      )
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
      if(post[1] == 'date') return this.datePipe.transform(post[0], 'dd/MM/YYYY');
      else if(post[1] == 'montant') return this.formatNumber(post[0], ' ');
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
          case 1: return '#35558d'; // bleu
          case 0: return '#ec6a31'; // orange
          default: return dataIcon.tooltip ?? '';
        }
      }
    
      //** Sinon, selon l'action
      switch (dataIcon.action) {
        case 'delete': return '#ec6a31';
        case 'edit': return '#35558d';
        default: return '';
      }
    }
    


}
