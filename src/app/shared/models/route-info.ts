import { Injectable } from "@angular/core";
import * as path from "path";
import { title } from "process";
import { BehaviorSubject, Observable } from "rxjs";

export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    showChildrenClass?: string;
    state?: boolean;
    children?: RouteInfo[];
}

export const ROUTES: RouteInfo[] = [
    //{ path: '/home', title: 'Accueil',  icon: 'home', class: '' ,showChildrenClass : '',children: [] },
    { path: '/ADM', title: 'Administration', icon: 'home', class: '', showChildrenClass: '', children: [
        { path: '/ADM/gestion-personnel', title: 'Géstion personnelles', icon: 'person', class: '', children: [
            { path: '/list-personnel', title: 'Liste des personnelles', icon: 'person', class: '' }
        ]},
        { path: '/ADM/gestion-etudiant', title: 'Géstion étudiant', icon: 'person', class: '', children: [
            { path: '/list-etudiant', title: 'Liste des personnelles', icon: 'person', class: '' }
        ]},
    ]},
    { path: '/MN', title: 'Monetique', icon: 'paid', class: '', showChildrenClass: '', children: [
        { path: '/MN/rechargement-espece', title: 'Recharge par espèce', icon: 'currency_exchange', class: '',children: [
          { path: '/recharger', title: 'Recharger', icon: 'person', class: '' }
        ] },
    ]},
];

@Injectable({
  providedIn: 'root'
})
export class MenuService {

    private menuItemsSource = new BehaviorSubject<RouteInfo[]>(ROUTES);
    public menuItems$: Observable<RouteInfo[]> = this.menuItemsSource.asObservable();

    constructor() {}

    setRoutes(module)
    {
        console.log("setRoutes",module);
        const moduleItem: RouteInfo[] = []; 
        for(let i = 0; i < module.length; i++) {

            const sousModule = [];

            for(let j = 0; j < module[i]['sous_modules'].length; j++) {

                const actions = [];

                for(let k = 0; k < module[i]['sous_modules'][j].actions.length; k++) {
                    if(module[i]['sous_modules'][j].actions[k].type_action_id == 1) {
                        actions.push({
                            path: '/' + module[i]['sous_modules'][j].actions[k].url,
                            title: module[i]['sous_modules'][j].actions[k].name,
                        })
                    }
                    
                }

                sousModule.push({
                    path: '/' + module[i]['sous_modules'][j].code,
                    title: module[i]['sous_modules'][j].name,
                    icon: module[i]['sous_modules'][j].icon || 'home',
                    class: '',
                    children : actions
                })
            }

            moduleItem.push({
                path: '/' + module[i].code,
                title: module[i].name,
                icon: module[i].icon || 'home',
                class: '',
                children : sousModule
            });
        }
        this.menuItemsSource.next(moduleItem);
    }


    updateMenuItems(parentPath:string): void {
        //const parent = ROUTES.find(route => route.path.includes(parentPath));
        const parent = this.menuItemsSource.getValue().find(route => route.path.includes(parentPath));
        this.menuItemsSource.next(parent?.children || []);
    }

    getCurrentMenuItems(): RouteInfo[] {
        return this.menuItemsSource.getValue();
    }
}