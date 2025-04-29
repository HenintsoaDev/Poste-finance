import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';
import { Auth, module_user } from 'app/shared/models/db';
import { MenuService, RouteInfo, ROUTES } from 'app/shared/models/route-info';
import { Translatable } from 'shared/constants/Translatable';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent extends Translatable implements OnInit {

    routes: RouteInfo[] = ROUTES;
    public user    : Auth = new Auth();
    public modules : module_user [] = [];

    constructor(private auth: AuthService, private router: Router, private menuService: MenuService) {
        super();
    }

    async ngOnInit() {
        this.user = <Auth> await  this.auth.getLoginUser();
        console.log("USER : ",this.user);
        this.modules = this.user.modules;
        this.modules =this.modules.filter(_=>( _.hasOneSubModuleAction && _.state == 1)  || (this.user.info.admin === 1 && _.state == 1) );
        this.menuService.setRoutes(this.modules);
        this.routes = this.menuService.getCurrentMenuItems();
        console.log("MODULES : ",)
    }

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
