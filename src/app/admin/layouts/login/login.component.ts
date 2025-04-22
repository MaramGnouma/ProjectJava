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

  onSubmitLogin() {
    this.authService.signin(this.form)
      .subscribe({
        next: (response) => {
          console.log('✅ Connexion réussie :', response, response.token);

          this.router.navigate(['/admin/']); // redirection vers la page d'accueil

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
