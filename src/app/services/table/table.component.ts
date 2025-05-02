import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
//import { valuesys } from '../../../../../../options';
import { PassageService } from './passage.service';
import formatNumber from 'number-handler'
import { Subscription } from 'rxjs';
import { valuesys } from 'app/shared/models/options';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
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


 constructor(             
  private http: HttpClient,
  private passageService: PassageService,
  private datePipe: DatePipe

  ) { 
}

subscription: Subscription;

async ngOnInit() {

  // Écouter le changement du tableau à travers le service
  this.subscription = this.passageService.getObservable().subscribe(filtre => {

    const url = `${this.endpoint}?page=1`;
    
    if (filtre === '') {
      this.getUrlDatatable(url);
    } else {
      this.getUrlDatatable(url, '', '', '', filtre);
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

//   let res =  {
//     "current_page": 1,
//     "data": [
//         {
//             "date_update": "2025-03-03",
//             "nom": "FREDNIBRUNAPIZA",
//             "prenom": "MAMY LEA",
//             "date_naissance": "2000-06-23",
//             "date_livrance": "2025-03-03",
//             "cin_passeport": "114012041107",
//             "name": "TNR - M - PHARMACIE",
//             "code_nin2": "1N6370000019",
//             "email": "tddbru@gmail.comAAA",
//             "telephone": "0345036777",
//             "faculte_name": "FACULTE DE MEDECINE - TNR",
//             "mention": "TNR - M - PHARMACIE",
//             "nom_domaine": "Sciences de la Sant\u00e9",
//             "niveau": "Master 1"
//         },
//         {
//             "date_update": "2025-03-03",
//             "nom": "LEMAINTY",
//             "prenom": "JERRY JENNIA",
//             "date_naissance": "1999-09-11",
//             "date_livrance": "2025-03-04",
//             "cin_passeport": "101212243753",
//             "name": "TNR - M - PHARMACIE",
//             "code_nin2": "0B9380000018",
//             "email": "jerryjenia@yahoo.com",
//             "telephone": "0328702475",
//             "faculte_name": "FACULTE DE MEDECINE - TNR",
//             "mention": "TNR - M - PHARMACIE",
//             "nom_domaine": "Sciences de la Sant\u00e9",
//             "niveau": "Master 1"
//         },
//         {
//             "date_update": "2025-03-03",
//             "nom": "MALALANIRINA",
//             "prenom": "MANOU SYLVANA",
//             "date_naissance": "2000-03-23",
//             "date_livrance": "2025-03-30",
//             "cin_passeport": "999999999999",
//             "name": "TNR - M - PHARMACIE",
//             "code_nin2": "0N3370000018",
//             "email": "positraOK.digitalisation@gmail.com",
//             "telephone": "0340111111",
//             "faculte_name": "FACULTE DE MEDECINE - TNR",
//             "mention": "TNR - M - PHARMACIE",
//             "nom_domaine": "Sciences de la Sant\u00e9",
//             "niveau": "Master 1"
//         },
//         {
//             "date_update": "2025-03-03",
//             "nom": "MIASALAHY",
//             "prenom": "KALORIANA ARIELLE",
//             "date_naissance": "1999-12-20",
//             "date_livrance": "2023-01-02",
//             "cin_passeport": "101252207208",
//             "name": "TNR - M - PHARMACIE",
//             "code_nin2": "0KC380000013",
//             "email": "ariellemiah@gmail.com",
//             "telephone": "0322838906",
//             "faculte_name": "FACULTE DE MEDECINE - TNR",
//             "mention": "TNR - M - PHARMACIE",
//             "nom_domaine": "Sciences de la Sant\u00e9",
//             "niveau": "Master 1"
//         },
//         {
//             "date_update": "2025-03-03",
//             "nom": "RANDRIANARIMANANA",
//             "prenom": "AINA FANJAVA",
//             "date_naissance": "2001-02-17",
//             "date_livrance": "2025-03-01",
//             "cin_passeport": "101252215107",
//             "name": "TNR - M - PHARMACIE",
//             "code_nin2": "0H2360000015",
//             "email": "fa.randriii17@gmail.com",
//             "telephone": "0346693170",
//             "faculte_name": "FACULTE DE MEDECINE - TNR",
//             "mention": "TNR - M - PHARMACIE",
//             "nom_domaine": "Sciences de la Sant\u00e9",
//             "niveau": "Master 1"
//         },
//         {
//             "date_update": "2025-03-03",
//             "nom": "MEVALAZA",
//             "prenom": "Jean Etiennes",
//             "date_naissance": "1999-01-20",
//             "date_livrance": "2014-12-12",
//             "cin_passeport": "123456789035",
//             "name": "ISTA - L - INFORMATIQUE",
//             "code_nin2": "0K1380000026",
//             "email": "etiennemevalaza@gmail.com",
//             "telephone": null,
//             "faculte_name": "IST AMBOSITRA",
//             "mention": "ISTA - L - INFORMATIQUE",
//             "nom_domaine": "Sciences de l'ing\u00e9nieur",
//             "niveau": "Licence 1"
//         },
//         {
//             "date_update": null,
//             "nom": "RABENARIVO",
//             "prenom": "SANDA",
//             "date_naissance": "1999-12-06",
//             "date_livrance": null,
//             "cin_passeport": "105012015620",
//             "name": "TNR - M - PHARMACIE",
//             "code_nin2": "06C380000012",
//             "email": "sandarabenarivo@yahoo.fr",
//             "telephone": "0347068184",
//             "faculte_name": "FACULTE DE MEDECINE - TNR",
//             "mention": "TNR - M - PHARMACIE",
//             "nom_domaine": "Sciences de la Sant\u00e9",
//             "niveau": "Master 1"
//         },
//         {
//             "date_update": null,
//             "nom": "RAFARANIAINA",
//             "prenom": "AMBOARA LAURA",
//             "date_naissance": "2000-08-13",
//             "date_livrance": null,
//             "cin_passeport": "101232171380",
//             "name": "TNR - M - PHARMACIE",
//             "code_nin2": "0D8370000018",
//             "email": "laurahopefulmie@gmail.com",
//             "telephone": "0348719026",
//             "faculte_name": "FACULTE DE MEDECINE - TNR",
//             "mention": "TNR - M - PHARMACIE",
//             "nom_domaine": "Sciences de la Sant\u00e9",
//             "niveau": "Master 1"
//         },
//         {
//             "date_update": null,
//             "nom": "RAHANTANIRINA",
//             "prenom": "FINARITRA SANDRINE",
//             "date_naissance": "1999-12-27",
//             "date_livrance": null,
//             "cin_passeport": "117152023735",
//             "name": "TNR - M - PHARMACIE",
//             "code_nin2": "0RC380000018",
//             "email": "positra.digitalisation@gmail.com",
//             "telephone": "0340651349",
//             "faculte_name": "FACULTE DE MEDECINE - TNR",
//             "mention": "TNR - M - PHARMACIE",
//             "nom_domaine": "Sciences de la Sant\u00e9",
//             "niveau": "Master 1"
//         },
//         {
//             "date_update": null,
//             "nom": "RAJAONA",
//             "prenom": "LALAINA AMBININTSOA",
//             "date_naissance": "2001-01-22",
//             "date_livrance": "2025-02-18",
//             "cin_passeport": "108052019684",
//             "name": "ISTA - L - INFORMATIQUE",
//             "code_nin2": "0M1360000017",
//             "email": "ambinintsoarajaona01@gmail.com",
//             "telephone": "0345620238",
//             "faculte_name": "IST AMBOSITRA",
//             "mention": "ISTA - L - INFORMATIQUE",
//             "nom_domaine": "Sciences de l'ing\u00e9nieur",
//             "niveau": "Licence 1"
//         }
//     ],
//     "from": 1,
//     "last_page": 19676,
//     "per_page": 10,
//     "to": 10,
//     "total": 196758
// }
  
  localStorage.setItem('data', JSON.stringify(res));

  //** Affichage de donnée dynamiser */
  let tableau = res.data.map((row: any) => 
    this.body.map((col: any) => 
        col.name === "id"
        ? this.listIcon.map(i => 
          ({ icon: i.icon, action: i.action, id: row[col] }) // Placer les icônes et les IDs dans un objet
        )
        : row[col.name] + '###' + col.type
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
}
