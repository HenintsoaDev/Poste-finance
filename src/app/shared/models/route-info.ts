import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    showChildrenClass?: string;
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

  updateMenuItems(parentPath:string): void {
    const parent = ROUTES.find(route => route.path.includes(parentPath));
    this.menuItemsSource.next(parent?.children || []);
  }

  getCurrentMenuItems(): RouteInfo[] {
    return this.menuItemsSource.getValue();
  }
}