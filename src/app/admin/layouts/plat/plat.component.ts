import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-plat',
  templateUrl: './plat.component.html',
  styleUrls: ['./plat.component.css'],
})
export class PlatComponent implements OnInit {
  plats: any[] = [];
  plat: any;
  activeCategorie: string = 'TOUT'; // Par défaut "TOUT" est actif

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // ✅ Ici backticks
    });
  }

  ngOnInit(): void {
    this.filterByCategorie('TOUT'); // ⚡ Appelle directement pour afficher tous les plats au début
  }

  editPlat(plat: any) {
    console.log('Edit:', plat);
    this.router.navigate(['/admin/plats/editPlat', plat.id]);
    // ✅ navigate ne prend pas de headers
  }

  deletePlat(plat: any) {
    if (confirm('Are you sure you want to delete this item?')) {
      this.http.delete(`http://localhost:9010/api/plats/${plat.id}`, { headers: this.getHeaders() })
        .subscribe({
          next: () => {
            console.log('Item deleted successfully');
            this.refreshData();
          },
          error: (err) => {
            console.error('Error deleting item:', err);
          }
        });
    }
  }

  refreshData() {
    this.http.get<any[]>('http://localhost:9010/api/plats', { headers: this.getHeaders() })
      .subscribe(data => {
        this.plats = data;
      }, error => {
        console.error('Erreur lors de la récupération des plats', error);
      });
  }

  filterByCategorie(categorie: string) {
    this.activeCategorie = categorie; // 🔥 Set active category

    if (categorie === 'TOUT') {
      this.http.get<any[]>('http://localhost:9010/api/plats', { headers: this.getHeaders() })
        .subscribe(data => {
          this.plats = data;
        }, error => {
          console.error('Erreur lors de la récupération des plats', error);
        });
    } else {
      this.http.get<any[]>(`http://localhost:9010/api/plats/categorie/${categorie}`, { headers: this.getHeaders() })
        .subscribe(data => {
          this.plats = data;
        }, error => {
          console.error('Erreur lors de la récupération des plats par catégorie', error);
        });
    }
  }
}
