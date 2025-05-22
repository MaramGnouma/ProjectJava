import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  form = {
    email: '',
    password: ''
  };

  photoPreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  togglePassword() {
    const input = document.getElementById('signup_password') as HTMLInputElement;
    const icon = document.getElementById('loginPasswordCreate');
    if (input.type === 'password') {
      input.type = 'text';
      icon?.classList.toggle('ri-eye-fill');
      icon?.classList.toggle('ri-eye-off-fill');
    } else {
      input.type = 'password';
      icon?.classList.toggle('ri-eye-fill');
      icon?.classList.toggle('ri-eye-off-fill');
    }
  }

  /**
   * Décode un token JWT et retourne son contenu
   * @param token Le token JWT à décoder
   * @returns Le contenu décodé du token
   */
  decodeJwtToken(token: string): any {
    try {
      // Le token JWT est composé de 3 parties séparées par des points
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error('Format de token invalide');
        return null;
      }

      // La deuxième partie contient les données (payload)
      const payload = parts[1];

      // Décodage de la partie payload (Base64URL)
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      // Conversion en objet JavaScript
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Erreur lors du décodage du token JWT:', error);
      return null;
    }
  }

  onSubmitLogin() {
    this.authService.signin(this.form)
      .subscribe({
        next: (response) => {
          console.log('✅ Connexion réussie :', response);

          // Vider le sessionStorage avant de stocker les nouvelles données
          sessionStorage.clear();

          // Récupérer le token
          const token = response.token;
          if (!token) {
            console.error('Aucun token dans la réponse');
            return;
          }

          // Décoder le token pour extraire les informations de l'employé
          const decodedToken = this.decodeJwtToken(token);
          console.log('Token décodé:', decodedToken);

          if (!decodedToken) {
            console.error('Impossible de décoder le token');
            return;
          }

          // Créer l'objet employé à partir des données du token
          const employeData = {
            id: decodedToken.id || '',
            nom_complet: decodedToken.nomComplet || '',
            email: decodedToken.email || this.form.email,
            role: decodedToken.role || '',
            status: decodedToken.status || '',
            // Ajouter d'autres champs si disponibles dans le token
            token: token // Conserver le token pour les futures requêtes
          };

          // Affichage des données pour débogage
          console.log('Données employé extraites du token:', employeData);

          // Sauvegarde dans sessionStorage
          sessionStorage.setItem('emp', JSON.stringify(employeData));

          // Vérification que les données ont bien été sauvegardées
          const savedData = sessionStorage.getItem('emp');
          console.log('Données sauvegardées en session:', savedData);

          // Redirection vers la page d'accueil
          this.router.navigate(['/admin/']);

          // Pop-up de réussite avec SweetAlert2
          Swal.fire({
            icon: 'success',
            title: 'Connexion réussie !',
            text: 'Bienvenue sur votre compte.',
          });
        },
        error: (error) => {
          console.error('❌ Erreur :', error);

          // Pop-up d'erreur avec SweetAlert2
          Swal.fire({
            icon: 'error',
            title: 'Erreur lors de la connexion',
            text: 'Veuillez vérifier vos identifiants.',
          });
        }
      });
  }
}
