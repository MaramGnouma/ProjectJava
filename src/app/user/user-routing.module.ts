import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserComponent } from './user.component';  // Assure-toi d'importer le composant parent
import { DetailsplatsComponent } from './layouts/detailsplats/detailsplats.component';
import { AcceuilComponent } from './layouts/acceuil/acceuil.component';
import { ContactComponent } from './layouts/contact/contact.component';
import { MenuComponent } from './layouts/menu/menu.component';
import { ProposComponent } from './layouts/propos/propos.component';

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      { path: 'acceuil', component: AcceuilComponent },
      { path: 'contacts', component: ContactComponent },
      { path: 'propos', component: ProposComponent },
      { path: 'menu', component: MenuComponent },
      { path: 'details', component: DetailsplatsComponent },
      { path: '', redirectTo: '/acceuil', pathMatch: 'full' } // Optionnel, redirige à la page d'accueil
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
