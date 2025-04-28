import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService, RouteInfo, ROUTES } from 'app/shared/models/route-info';
import { Translatable } from 'shared/constants/Translatable';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent extends Translatable implements OnInit {

    routes: RouteInfo[] = ROUTES;

    constructor(private router: Router, private menuService: MenuService) {
        super();
    }

    ngOnInit(): void {}

    getMenuChildrenByPath(parentPath: string): any[] {
        const parent = ROUTES.find(route => route.path === parentPath);
        return parent?.children || [];
    }

    goTo(module : string, pathSelected)
    {
        console.log(this.getMenuChildrenByPath(module));
        this.menuService.updateMenuItems(module);
        this.router.navigate(['/'+module],{
            state: { modules : module,selectedRoute: pathSelected, menuModule : this.getMenuChildrenByPath(module) }
        });
    }

    

}
