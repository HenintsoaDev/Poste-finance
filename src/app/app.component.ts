import { Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import * as e from 'express';
import Swal from 'sweetalert2';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    showLayout: boolean = true;
    showBreadcrumb = true;
    showSidebar = true;

    sidebar: HTMLElement | null = null
    @ViewChild('sidebarAppMenu') menuSideBar!: ElementRef<HTMLElement>;
    @ViewChild('navBarAppMenu') menuNavBar!: ElementRef<HTMLElement>;
    isMenuSidebarOpen = false;
  
    // Gère les clics partout sur le document
    @HostListener('document:click', ['$event.target'])
    async onClick(target: HTMLElement): Promise<void> {
        
        const sidebar = document.getElementsByClassName("sidebar")[0] as HTMLElement;
        if ($(window).width() > 991) {return;}
        if (!sidebar.classList.contains("hidden")) this.isMenuSidebarOpen = true; else this.isMenuSidebarOpen = false;      

        const clickedInside = this.menuSideBar.nativeElement.contains(target);
        const clickedNavBar = this.menuNavBar.nativeElement.contains(target);

        if(clickedNavBar)
        {return}

        if(!clickedInside){
            sidebar.classList.add("hidden");
            this.isMenuSidebarOpen = false;
        }
    }

    
    constructor(private router: Router) {
        this.router.events.subscribe(() => {
        const currentRoute = this.router.url;
        this.showLayout = !(currentRoute === '/login');
        this.showSidebar = !(currentRoute === '/home');
        this.showBreadcrumb = !(currentRoute === '/login' || currentRoute === '/home');
        });
    }

    goToLogin()
    {
        Swal.fire({
            title: 'Déconnexion',
            text: 'Voulez-vous vraiment vous déconnecter ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Oui, déconnexion',
            cancelButtonText: 'Annuler'
            }).then((result) => {
            if (result.isConfirmed) {
                this.router.navigate(['/login'])
            }
        });
    }
}
