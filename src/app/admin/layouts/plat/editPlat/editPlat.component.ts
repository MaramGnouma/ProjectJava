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
private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
  ngOnInit(): void {
    // 1. Récupérer l'ID depuis l'URL
    this.platId = this.route.snapshot.paramMap.get('id');

    if (this.platId) {
      // 2. Charger les données du plat
      this.http.get(`http://localhost:9010/api/plats/${this.platId}`, { headers: this.getHeaders() })
        .subscribe({
          next: (plat: any) => {
            // 3. Pré-remplir le formulaire
            this.formData = {
              nom: plat.nom,
              prix: plat.prix,
              categorie: plat.categorie,
              description: plat.description
            };

            // Si vous voulez aussi afficher l'image existante
            if (plat.image) {
              this.imagePreview = plat.image; // Adaptez selon votre structure de données
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

      // Aperçu de l'image
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
