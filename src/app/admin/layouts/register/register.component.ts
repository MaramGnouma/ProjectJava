import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  constructor(private router: Router, private authService: AuthService) {}

  form = {
    nomComplet: '',
    telephone: '',
    sexe: '',
    salaireParJour: 0,
    email: '',
    role: '',
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

  onSubmitRegister() {
    this.authService.signup(this.form).subscribe({
      next: (response) => {
        console.log('✅ Inscription réussie :', response);
        Swal.fire({
          icon: 'success',
          title: 'Inscription réussie !',
          text: 'Bienvenue sur votre espace.'
        });
        this.router.navigate(['/admin/signin']);
      },
      error: (error) => {
        console.error('❌ Erreur :', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur lors de l\'inscription',
          text: 'Veuillez vérifier vos informations.'
        });
      }
    });
  }
}
