import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/admin/Services/auth.service';

@Component({
  selector: 'app-editPlat',
  templateUrl: './editPlat.component.html',
  styleUrls: ['./editPlat.component.css']
})
export class EditPlatComponent implements OnInit {
  formData: any = {
    nom: '',
    prix: 0,
    categorie: '',
    description: '',
    image: null
  };
  imagePreview: string | ArrayBuffer | null = null;
  platId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  // ✅ Ne pas mettre Content-Type ici, uniquement Authorization
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  ngOnInit(): void {
    this.platId = this.route.snapshot.paramMap.get('id');

    if (this.platId) {
      this.http.get(`http://localhost:9010/api/plats/${this.platId}`, { headers: this.getHeaders() })
        .subscribe({
          next: (plat: any) => {
            this.formData = {
              nom: plat.nom,
              prix: plat.prix,
              categorie: plat.categorie,
              description: plat.description,
              image: null // on réinitialise pour éviter de mettre une chaîne base64 dans FormData
            };
            // ✅ Afficher l'image existante si disponible
            if (plat.image) {
              this.imagePreview = plat.image; // Si c'est une URL ou un base64
            }
          },
          error: (err) => {
            console.error('Erreur lors du chargement du plat', err);
          }
        });
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.formData.image = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (!this.platId) return;

    const formPayload = new FormData();
    formPayload.append('nom', this.formData.nom);
    formPayload.append('prix', this.formData.prix.toString());
    formPayload.append('categorie', this.formData.categorie);
    formPayload.append('description', this.formData.description);
    if (this.formData.image) {
      formPayload.append('image', this.formData.image);
    }

    this.http.put(`http://localhost:9010/api/plats/${this.platId}`, formPayload, { headers: this.getHeaders() })
      .subscribe({
        next: (response) => {
          alert('Plat mis à jour avec succès!');
          this.router.navigate(['/admin/plats']);
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour', err);
        }
      });
  }
}
