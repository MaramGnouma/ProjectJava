import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  plats: any[] = [];
  activeFilter: string = 'TOUT';
  selectedPlat: any = null;
  quantity: number = 1;
  cartItems: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadPlats('TOUT');
    this.loadCart();
  }

  filterItems(categorie: string) {
    this.activeFilter = categorie;
    this.loadPlats(categorie);
  }

 loadPlats(categorie: string) {
  const token = localStorage.getItem('token'); // ou sessionStorage, selon ton système
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  const url = categorie === 'TOUT'
    ? 'http://localhost:9010/api/plats'
    : `http://localhost:9010/api/plats/categorie/${categorie}`;

  this.http.get<any>(url, { headers }).subscribe({
    next: (data) => {
      if (Array.isArray(data)) {
        this.plats = data;
      } else if (data.success && Array.isArray(data.data)) {
        this.plats = data.data;
      } else {
        console.error('Format de données inattendu:', data);
      }
    },
    error: (err) => console.error('Erreur serveur:', err)
  });
}

  openQuantityPopup(plat: any) {
    this.selectedPlat = plat;
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find((item: any) => item.id === plat.id);
    this.quantity = existing ? existing.quantity : 1;
  }

  addToCart() {
    console.log('Selected Plat:', this.selectedPlat);
    if (this.selectedPlat && this.quantity > -1) {
      let cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingIndex = cart.findIndex((item: any) => item.id === this.selectedPlat.id);

      if (existingIndex > -1) {
        // Update quantity
        cart[existingIndex].quantity = this.quantity;
      } else {
        // Add new item
        const item = {
          id: this.selectedPlat.id,
          name: this.selectedPlat.nom,
          price: this.selectedPlat.prix,
          quantity: this.quantity
        };
        cart.push(item);
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      this.cartItems = cart;

      this.selectedPlat = null;
      this.quantity = 0;
    }
  }

  loadCart() {
    this.cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
  }

  goToDetails(platId: number) {
    this.router.navigate(['/user/menu/' + platId]);
  }
}
