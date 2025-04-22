import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './layouts/dashboard/dashboard.component';
import { LoginComponent } from './layouts/login/login.component';
import { RegisterComponent } from './layouts/register/register.component';
import { ListeEmployesComponent } from './layouts/liste-employes/liste-employes.component';
import { AdminComponent } from './admin.component';  // ⚠️ tu avais oublié d'importer AdminComponent

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,  // <-- ici le parent
    children: [
      { path: '', component: DashboardComponent },
      { path: 'listeAttente', component: ListeEmployesComponent },
      { path: 'signup', component: RegisterComponent },
      { path: 'signin', component: LoginComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
