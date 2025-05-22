import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-commande',
  templateUrl: './commande.component.html',
  styleUrls: ['./commande.component.css'],
})
export class CommandeComponent implements OnInit {
  plats: any[] = [];
  commande: any;
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
      'Authorization': `Bearer ${token}`
    });
  }

  ngOnInit(): void {
    this.refreshData(); // ⚡ Appelle directement pour afficher tous les plats au début
  }


  deletePlat(commande: any) {
    if (confirm('Are you sure you want to delete this item?')) {
      this.http.delete('http://localhost:9010/api/commandes/deletePlat?idCommande='+ commande.idCommande+'&idPlat='+ commande.idPlat, { headers: this.getHeaders() })
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
    this.http.get<any[]>('http://localhost:9010/api/commandes/all', { headers: this.getHeaders() })
      .subscribe(data => {
        this.plats = data;
      });
  }


}
