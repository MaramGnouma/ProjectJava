import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { AcceuilComponent } from './layouts/acceuil/acceuil.component';
import { ContactComponent } from './layouts/contact/contact.component';
import { DetailsplatsComponent } from './layouts/detailsplats/detailsplats.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { HeaderclientComponent } from './layouts/headerclient/headerclient.component';
import { MenuComponent } from './layouts/menu/menu.component';
import { ProposComponent } from './layouts/propos/propos.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [
    UserComponent,
    AcceuilComponent,
    ContactComponent,
    DetailsplatsComponent,
    FooterComponent,
    HeaderclientComponent,
    MenuComponent,
    ProposComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    UserRoutingModule
  ]
})
export class UserModule { }
