import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './layouts/dashboard/dashboard.component';
import { HeaderComponent } from './layouts/header/header.component';
import { ListeEmployesComponent } from './layouts/liste-employes/liste-employes.component';
import { LoginComponent } from './layouts/login/login.component';
import { RegisterComponent } from './layouts/register/register.component';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { TableRestaurantComponent } from './layouts/table-restaurant/table-restaurant.component';
import { AddPlatComponent } from './layouts/plat/addPlat/addPlat.component';
import { EditPlatComponent } from './layouts/plat/editPlat/editPlat.component';
import { PlatComponent } from './layouts/plat/plat.component';
import { EmployesComponent } from './layouts/employes/employes.component';
import { CommandeComponent } from './layouts/commande/commande.component';

@NgModule({
  declarations: [
    AdminComponent,
    DashboardComponent,
    HeaderComponent,
    ListeEmployesComponent,
    LoginComponent,
    RegisterComponent,
    TableRestaurantComponent,
    PlatComponent,
    AddPlatComponent,
    EditPlatComponent,
    EmployesComponent,
    CommandeComponent


  ],
  imports: [
    CommonModule,
    RouterModule,
    AdminRoutingModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ]
})
export class AdminModule { }
