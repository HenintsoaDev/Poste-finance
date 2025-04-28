import { Routes } from '@angular/router';
import { DataTableComponent } from 'app/views/modules/adm/data-table/data-table.component';
import { ProfilComponent } from 'app/views/profil/profil.component';


export const AdminLayoutRoutes: Routes = [
    { path: 'data-table',      component: DataTableComponent },
    { path: 'my-profil',      component: ProfilComponent },
];
