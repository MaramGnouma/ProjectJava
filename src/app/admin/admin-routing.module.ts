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
import { AuthGuard } from './Services/auth.guard';
import { EmployesComponent } from './layouts/employes/employes.component';
import { CommandeComponent } from './layouts/commande/commande.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
      { path: 'listeAttente', component: ListeEmployesComponent, canActivate: [AuthGuard] },
      { path: 'signup', component: RegisterComponent }, // 🟢 accessible sans login
      { path: 'signin', component: LoginComponent },   // 🟢 accessible sans login
      { path: 'tableRestaurant', component: TableRestaurantComponent, canActivate: [AuthGuard] },
      { path: 'plats', component: PlatComponent, canActivate: [AuthGuard] },
      { path: 'plats/addPlat', component: AddPlatComponent, canActivate: [AuthGuard] },
      { path: 'plats/editPlat/:id', component: EditPlatComponent, canActivate: [AuthGuard] },
     { path: 'employes', component: EmployesComponent, canActivate: [AuthGuard] },
    { path: 'commandes', component: CommandeComponent , canActivate: [AuthGuard] },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
