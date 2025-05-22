import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../Services/client.service';
import { Client } from '../../Models/client';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authentification',
  templateUrl: './authentification.component.html',
  styleUrls: ['./authentification.component.css']
})
export class AuthentificationComponent {
  signupForm: FormGroup;
  loginForm: FormGroup;
  isActive = false;
  showPassword = false;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      telephone: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    });

    this.loginForm = this.fb.group({
      loginEmail: ['', [Validators.required, Validators.email]],
      loginPassword: ['', Validators.required],
    });
  }

  toggleActive(isSignUp: boolean): void {
    this.isActive = isSignUp;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSignupSubmit(): void {
    if (this.signupForm.invalid) return;

    this.isSubmitting = true;
    const newClient: Client = this.signupForm.value;

    this.clientService.register(newClient).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Inscription réussie',
          text: 'Vous pouvez maintenant vous connecter.',
          confirmButtonColor: '#3085d6'
        });
        this.signupForm.reset();
        this.isActive = false;
      },
      error: (err) => {
        console.error('Erreur inscription :', err);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Erreur lors de l\'inscription.',
          confirmButtonColor: '#d33'
        });
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  onLoginSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isSubmitting = true;
    const email = this.loginForm.value.loginEmail;
    const password = this.loginForm.value.loginPassword;

    this.clientService.login(email, password).subscribe({
      next: () => {
        this.clientService.getCurrentClient().subscribe({
          next: (clientData) => {
sessionStorage.setItem('clientConnecte', JSON.stringify(clientData));
const client = clientData as Client;
localStorage.setItem('idClient', client.id!.toString());
console.log('Client connecté:', clientData);
Swal.fire({
  icon: 'success',
  title: 'Connexion réussie',
  text: 'Redirection vers l\'accueil...',
  timer: 2000,
  showConfirmButton: false
}).then(() => {
  this.router.navigate(['/user/acceuil']);
});
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Erreur lors de la récupération des données.',
            });
          }
        });
      },
      error: (err) => {
        console.error('Erreur login :', err);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Email ou mot de passe incorrect.',
        });
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  onLogout(): void {
    this.clientService.logout().subscribe({
      next: () => {
        sessionStorage.removeItem('clientConnecte');
        Swal.fire({
          icon: 'success',
          title: 'Déconnexion',
          text: 'Vous avez été déconnecté avec succès.',
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Erreur lors de la déconnexion.',
        });
      }
    });
  }

  get clientConnecte(): Client | null {
    const stored = sessionStorage.getItem('clientConnecte');
    return stored ? JSON.parse(stored) : null;
  }
}
