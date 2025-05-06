import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'app/services/breadcrumb.service';
import { SoldeService } from 'app/services/solde.service';
import { Translatable } from 'shared/constants/Translatable';

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent extends Translatable implements OnInit {

    walletSolde = 0;
    carteSolde = 0;

    constructor(public breadcrumbService: BreadcrumbService,private soldeService: SoldeService) { 
        super();
    }

    ngOnInit(): void {

        this.walletSolde = this.soldeService.getWalletSolde();
        this.carteSolde = this.soldeService.getCarteSolde();
        
        /*this.soldeService.walletSolde$.subscribe(value => {
            this.walletSolde = value;
        });
      
        this.soldeService.carteSolde$.subscribe(value => {
            this.carteSolde = value;
        });*/
    }

    goTo(){
      
    }

}
