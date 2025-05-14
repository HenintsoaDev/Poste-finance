[<p align="center"><img src="https://github.com/numherit-dev/pmp/blob/main/src/assets/img/num.webp" alt="logo numherit" width="200"/></p>](#)

[<p align="center"><h1 style="color:#e2590f">WELCOME TO PHCO</h1></p>](#)

1. ## _Structure du projet_

```
PHCO V2
├── CHANGELOG.md
├── LICENSE.md
├── README.md
├── angular-cli.json
├── documentation
├── e2e
├── karma.conf.js
├── package-lock.json
├── package.json
├── protractor.conf.js
├── src
│   ├── app
│   │   ├── app.component.css
│   │   ├── app.component.html
│   │   ├── app.component.spec.ts
│   │   ├── app.component.ts
│   │   ├── app.module.ts
│   │   ├── app.routing.ts
│   │   ├── components
│   │   │   ├── components.module.ts
│   │   │   ├── footer
│   │   │   │   ├── footer.component.css
│   │   │   │   ├── footer.component.html
│   │   │   │   ├── footer.component.spec.ts
│   │   │   │   └── footer.component.ts
│   │   │   ├── navbar
│   │   │   │   ├── navbar.component.css
│   │   │   │   ├── navbar.component.html
│   │   │   │   ├── navbar.component.spec.ts
│   │   │   │   └── navbar.component.ts
│   │   │   └── sidebar
│   │   │       ├── sidebar.component.css
│   │   │       ├── sidebar.component.html
│   │   │       ├── sidebar.component.spec.ts
│   │   │       └── sidebar.component.ts
│   │   ├── layouts
│   │   │   └── admin-layout
│   │   │       ├── admin-layout.component.html
│   │   │       ├── admin-layout.component.scss
│   │   │       ├── admin-layout.component.spec.ts
│   │   │       ├── admin-layout.component.ts
│   │   │       ├── admin-layout.module.ts
│   │   │       └── admin-layout.routing.ts
│   │   ├── services //Pour les services api
│   │   ├── shared //Pour les éléments partagés (constant,model,...)
│   │   ├── views //Pour les views (sous modules, login,...), Si c'est l'affichage d'un écrant, il faut le mettre dans le dossier module/nom_du_module/...
│   ├── assets
│   │   ├── css
│   │   │   └── demo.css
│   │   ├── img
│   │   └── scss
│   │       ├── core
│   │       └── material-dashboard.scss
│   ├── environments
│   ├── favicon.ico
│   ├── index.html
│   ├── main.ts
│   ├── polyfills.ts
│   ├── styles.css
│   ├── test.ts
│   ├── tsconfig.app.json
│   ├── tsconfig.spec.json
│   └── typings.d.ts
├── tsconfig.json
├── tslint.json
└── typings

```

2. ## _Création d'un component_
   Après avoir générer un component, il faut faire les étapes suivant :
   - Si le compenent nécéssite le layout du projet :
     - il faut enlever le component dans _app.module.ts_
     - il faut ajouter dans la variable "route", dans _app.routing.ts_ la page comme ceci : **[{ path: 'data-table', component: DataTableComponent }](#)**
     - Après on refait la même chose dans la page **[app/layouts/admin-layou/admin-layout.routing.ts](#)**,il faut ajouter dans la variable `route`, la page comme ceci : **[{ path: 'data-table', component: DataTableComponent }](#)**
     - Après, il faut déclarer le component dans **[app/layouts/admin-layou/admin-layout.module.ts](#)** dans `declaration`
     - Afin d'afficher le lien de la page dans le menu sidebar, il faut l'ajouter dans **[app/layouts/admin-layou/admin-layout.module.ts](#)** comme ceci:
       - Pour un simple menu :
       ```typescript
       export const ROUTES: RouteInfo[] = [
         {
           path: "/home",
           title: "Tableau de board",
           icon: "dashboard",
           class: "",
           children: [],
         },
       ];
       ```
       - Pour un menu avec des sous-menu:
       ```typescript
       export const ROUTES: RouteInfo[] = [
         {
           path: "/user-profile",
           title: "User Profile",
           icon: "person",
           class: "",
           children: [
             { path: "/settings/profile", title: "Profil", icon: "person" },
             { path: "/settings/security", title: "Sécurité", icon: "lock" },
             {
               path: "/settings/preferences",
               title: "Préférences",
               icon: "tune",
             },
           ],
         },
       ];
       ```
   - Si le component ne nécéssite pas le layout :
     - il faut ajouter le component dans _app.module.ts_
     - Après il faut modifier le code dans ... comme ceci :
       ```typescript
       this.showLayout = !(
         currentRoute === "/login" || currentRoute === "/laPageSansLayout"
       );
       ```
   - Le contenu HTML du component doit être dans un élément DIV avec la class : main-containt:
     ```html
     <div class="main-content"></div>
     ```
