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
    this.refreshData();
  }

  editPlat(plat: any) {
    console.log('Edit:', plat);
    this.router.navigate(['/admin/plats/editPlat', plat.id]);
    // ⚡ Ne PAS mettre { headers } dans navigate (navigate ne prend pas des headers)
  }

  deletePlat(plat: any) {
    if (confirm('Are you sure you want to delete this item?')) {
      this.http.delete('http://localhost:9010/api/plats/' + plat.id, { headers: this.getHeaders() })
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
      });
  }
}
