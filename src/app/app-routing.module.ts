import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
  { path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserModule) },

  // Redirection vers l'accueil de l'utilisateur
  { path: '', redirectTo: '/user/acceuil', pathMatch: 'full' },  // redirection vers '/user/acceuil'

  // Gérer toute autre route non définie
  { path: '**', redirectTo: '/user/acceuil' }  // redirection par défaut si l'URL n'est pas trouvée
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
