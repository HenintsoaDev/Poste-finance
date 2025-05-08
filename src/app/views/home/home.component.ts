import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';
import { Auth, module_user } from 'app/shared/models/db';
import { MenuService, RouteInfo, ROUTES } from 'app/shared/models/route-info';
import { Translatable } from 'shared/constants/Translatable';
import Swal from 'sweetalert2';


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
        this.modules = this.user.modules;
        this.modules =this.modules.filter(_=>( _.hasOneSubModuleAction && _.state == 1)  || (this.user.info.admin === 1 && _.state == 1) );
        this.routes = this.menuService.getCurrentMenuItems();
    }

    getMenuChildrenByPath(parentPath: string): any[] {
        const parent = ROUTES.find(route => route.path === parentPath);
        return parent?.children || [];
    }

    goTo(module : string, pathSelected)
    {
        this.menuService.updateMenuItems(module);
        this.menuService.setMenuItemsModule(module);
        this.router.navigate(['/app-module', module.replace('/','')]);
    }

    goToLogin()
    {
        Swal.fire({
            title: 'Déconnexion',
            text: 'Voulez-vous vraiment vous déconnecter ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Oui, déconnexion',
            cancelButtonText: 'Annuler',
            allowOutsideClick: false,
            customClass: {
                confirmButton: 'swal-button--confirm-custom',
                cancelButton: 'swal-button--cancel-custom'
            },
            }).then((result) => {
            if (result.isConfirmed) {
                this.auth.logout();
            }
        });
    }

    

}
