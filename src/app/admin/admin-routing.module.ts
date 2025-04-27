import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './layouts/dashboard/dashboard.component';
import { LoginComponent } from './layouts/login/login.component';
import { RegisterComponent } from './layouts/register/register.component';
import { ListeEmployesComponent } from './layouts/liste-employes/liste-employes.component';
import { AdminComponent } from './admin.component';  // ⚠️ tu avais oublié d'importer AdminComponent
import { TableRestaurantComponent } from './layouts/table-restaurant/table-restaurant.component';
import { AddPlatComponent } from './layouts/plat/addPlat/addPlat.component';
import { EditPlatComponent } from './layouts/plat/editPlat/editPlat.component';
import { PlatComponent } from './layouts/plat/plat.component';
import { EmployesComponent } from './layouts/employes/employes.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,  // <-- ici le parent
    children: [
      { path: '', component: DashboardComponent },
      { path: 'listeAttente', component: ListeEmployesComponent },
      { path: 'signup', component: RegisterComponent },
      { path: 'signin', component: LoginComponent },
      { path: 'tableRestaurant', component: TableRestaurantComponent },
      { path: 'plats', component: PlatComponent },
      { path: 'plats/addPlat', component: AddPlatComponent },
      { path: 'plats/editPlat/:id', component: EditPlatComponent },
      { path: 'employes', component: EmployesComponent },



    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
