import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuService } from 'app/shared/models/route-info';
import { Translatable } from 'shared/constants/Translatable';

declare interface RouteChildrenInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

@Component({
  selector: 'app-adm',
  templateUrl: './adm.component.html',
  styleUrls: ['./adm.component.scss']
})
export class AdmComponent extends Translatable implements OnInit {

    isModule:boolean = false;
    routesSousModule: RouteChildrenInfo[] = [];
    routeModule = []
    moduleSelected = '';

    constructor(private router: Router,private route: ActivatedRoute,private menuService: MenuService) {
        super();
        this.router.events.subscribe(() => {
            this.isModule = (this.router.url === '/ADM' );
            const navigation = this.router.getCurrentNavigation();
            if (navigation?.extras?.state) {
                const moduleSelected = navigation.extras.state['modules'] || '';
                const selectedRoute = navigation.extras.state['selectedRoute'] || [];

                this.moduleSelected = moduleSelected;
                
                // Vous pouvez maintenant utiliser this.selectedRoute
                if(selectedRoute.children)
                {
                    this.routeModule = selectedRoute;
                    this.routesSousModule = selectedRoute.children;
                }
            }
        });
    }

    ngOnInit(): void {
        
    }

}
