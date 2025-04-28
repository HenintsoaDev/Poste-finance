import { Component, OnInit, ElementRef, HostListener, ViewChild } from '@angular/core';

import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ROUTES } from 'app/shared/models/route-info';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    listTitles: any[];
    location: Location;
    mobile_menu_visible: any = 0;
    private toggleButton: any;
    private sidebarVisible: boolean;
    isSidebarOpen: boolean = true;
    navbarResponsive: HTMLElement | null = null

    @ViewChild('menuDropdownResponsive') menuDropdown!: ElementRef<HTMLElement>;
    isMenuResponsiveOpen = false;
    showNavbar = true;

    // Gère les clics partout sur le document
    @HostListener('document:click', ['$event.target'])
    onClick(target: HTMLElement): void {
        if (!this.isMenuResponsiveOpen) return;

        const clickedInside = this.menuDropdown.nativeElement.contains(target);
        
        if (!clickedInside) {
            const menuResponsive = document.getElementsByClassName("menu-dropdown-responsive")[0] as HTMLElement;
            menuResponsive.style.display = "none";
            this.isMenuResponsiveOpen = false;
        }
    }

    constructor(location: Location,  private element: ElementRef, private router: Router) {
        this.location = location;
        this.sidebarVisible = false;
        this.router.events.subscribe(() => {
            const currentRoute = this.router.url;
            this.showNavbar = !(currentRoute === '/login' || currentRoute === '/home');
        });
    }

    ngOnInit(){
        this.listTitles = ROUTES.filter(listTitle => listTitle);
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
        this.router.events.subscribe((event) => {
            this.sidebarClose();
            var $layer: any = document.getElementsByClassName('close-layer')[0];
            if ($layer) {
            $layer.remove();
            this.mobile_menu_visible = 0;
            }
        });
        

        const sidebar = document.getElementsByClassName("sidebar")[0] as HTMLElement;
        const mainPanel = document.getElementsByClassName("main-panel")[0] as HTMLElement;
        const navBar = document.getElementsByClassName("navbar-fixed")[0] as HTMLElement;
        const footerBar = document.getElementsByClassName("footer")[0] as HTMLElement;
        this.navbarResponsive = document.getElementsByClassName("responsive-bar")[0] as HTMLElement;
        this.toggleNavbarEvent(); 
        
        if ($(window).width() > 991) {
            sidebar.classList.remove("hidden");
            return false;
        }
        
        sidebar.classList.add("hidden");
        mainPanel.classList.remove("full-main-panel");
        navBar.classList.remove("full-main-panel");
        footerBar.classList.remove("full-main-panel");
        
    }


    @HostListener('window:resize', [])
    onResize() {
        this.toggleNavbarEvent();
    }

    toggleNavbarEvent() {
        if (this.navbarResponsive) {
            if (window.innerWidth > 991) {
                this.navbarResponsive.classList.add("hide-navbar");
            } else {
                this.navbarResponsive.classList.remove("hide-navbar");
            }
        }
    }

    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const body = document.getElementsByTagName('body')[0];
        setTimeout(function(){
            toggleButton.classList.add('toggled');
        }, 500);

        body.classList.add('nav-open');

        this.sidebarVisible = true;
    };
    sidebarClose() {
        const body = document.getElementsByTagName('body')[0];
        //this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        body.classList.remove('nav-open');
    };
    sidebarToggle() {
        var $toggle = document.getElementsByClassName('navbar-toggler')[0];

        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
        const body = document.getElementsByTagName('body')[0];

        if (this.mobile_menu_visible == 1) {
            // $('html').removeClass('nav-open');
            body.classList.remove('nav-open');
            if ($layer) {
                $layer.remove();
            }
            setTimeout(function() {
                $toggle.classList.remove('toggled');
            }, 400);

            this.mobile_menu_visible = 0;
        } else {
            setTimeout(function() {
                $toggle.classList.add('toggled');
            }, 430);

            var $layer = document.createElement('div');
            $layer.setAttribute('class', 'close-layer');


            if (body.querySelectorAll('.main-panel')) {
                document.getElementsByClassName('main-panel')[0].appendChild($layer);
            }else if (body.classList.contains('off-canvas-sidebar')) {
                document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
            }

            setTimeout(function() {
                $layer.classList.add('visible');
            }, 100);

            $layer.onclick = function() { //asign a function
              body.classList.remove('nav-open');
              this.mobile_menu_visible = 0;
              $layer.classList.remove('visible');
              setTimeout(function() {
                  $layer.remove();
                  $toggle.classList.remove('toggled');
              }, 400);
            }.bind(this);

            body.classList.add('nav-open');
            this.mobile_menu_visible = 1;

        }
    };

    toggleSidebar(){
        const sidebar = document.getElementsByClassName("sidebar")[0] as HTMLElement;
        const mainPanel = document.getElementsByClassName("main-panel")[0] as HTMLElement;
        const navBar = document.getElementsByClassName("navbar-fixed")[0] as HTMLElement;
        const footerBar = document.getElementsByClassName("footer")[0] as HTMLElement;
        
        if (sidebar) {
            if (!sidebar.classList.contains("hidden")) {
                //sidebar.classList.add("hidden");
                mainPanel.classList.add("full-main-panel");
                //navBar.classList.add("full-main-panel");
                //footerBar.classList.add("full-main-panel");
            } else {
                sidebar.classList.remove("hidden");
                mainPanel.classList.remove("full-main-panel");
                //navBar.classList.remove("full-main-panel");
                //footerBar.classList.remove("full-main-panel");
            }
        }
        
        this.isSidebarOpen = !this.isSidebarOpen;
    }

    toggleSidebarResponsive(){
        const sidebar = document.getElementsByClassName("sidebar")[0] as HTMLElement;
        const mainPanel = document.getElementsByClassName("main-panel")[0] as HTMLElement;
        const navBar = document.getElementsByClassName("navbar-fixed")[0] as HTMLElement;
        const footerBar = document.getElementsByClassName("footer")[0] as HTMLElement;
       
        if (sidebar.classList.contains("hidden")) sidebar.classList.remove("hidden");
        
        this.isSidebarOpen = !this.isSidebarOpen;
    }

    getTitle(){
      var titlee = this.location.prepareExternalUrl(this.location.path());
      if(titlee.charAt(0) === '#'){
          titlee = titlee.slice( 1 );
      }

      for(var item = 0; item < this.listTitles.length; item++){
          if(this.listTitles[item].path === titlee){
              return this.listTitles[item].title;
          }
      }
      return 'Dashboard';
    }

    isMobileMenu() {
        
        if ($(window).width() > 991) {
            return false;
        }
      return true;
    };

    toggleMenuResponsive(event: MouseEvent){
        event.stopPropagation();
        if ($(window).width() < 991) {
            const menuResponsive = document.getElementsByClassName("menu-dropdown-responsive")[0] as HTMLElement;
            if((!this.isMenuResponsiveOpen)){
                menuResponsive.style.display = "block";
                this.isMenuResponsiveOpen = true;
            }else{
                menuResponsive.style.display = "none";
                this.isMenuResponsiveOpen = false;
            }
        }
    }

    goTo(module : String, pathSelected)
    {
        this.router.navigate(['/'+module],{
            state: { modules : module,selectedRoute: pathSelected }
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
            cancelButtonText: 'Annuler',
            allowOutsideClick: false,
            customClass: {
                confirmButton: 'swal-button--confirm-custom',
                cancelButton: 'swal-button--cancel-custom'
            },
            }).then((result) => {
            if (result.isConfirmed) {
                this.router.navigate(['/login'])
            }
        });
    }
}
