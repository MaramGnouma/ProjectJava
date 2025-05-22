import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-headerclient',
  templateUrl: './headerclient.component.html',
  styleUrls: ['./headerclient.component.css']
})
export class HeaderclientComponent implements OnInit, AfterViewInit {

  cartItems: any[] = [];
  clientId: string | null = '';
  isConnected: boolean = false;
  clientData: any = null;
  showCart: boolean = false;

  @ViewChild('popupWrapper') popupWrapper!: ElementRef;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const sessionClient = sessionStorage.getItem('clientConnecte');

    if (sessionClient) {
      this.clientData = JSON.parse(sessionClient);
      this.clientId = this.clientData.id;
      this.isConnected = true;
    } else {
      this.clientId = localStorage.getItem('idClient');
      this.isConnected = this.clientId !== null;

      if (this.isConnected && this.clientId) {
        this.loadClientData(this.clientId);
      }
    }

    this.loadCart();
  }

  ngAfterViewInit(): void {}

  loadClientData(id: string) {
    this.http.get(`http://localhost:9010/api/client/${id}`).subscribe({
      next: (data) => {
        this.clientData = data;
        console.log('Client data:', data);
      },
      error: (err) => {
        console.error('Erreur chargement client :', err);
      }
    });
  }

  toggleCart(event: MouseEvent): void {
    this.showCart = !this.showCart;
    event.stopPropagation();
    if (this.showCart) {
      this.loadCart();
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    if (this.popupWrapper && !this.popupWrapper.nativeElement.contains(event.target)) {
      this.showCart = false;
    }
  }

  loadCart(): void {
    const storedCart = localStorage.getItem('cart');
    this.cartItems = storedCart ? JSON.parse(storedCart) : [];
  }

  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  close(): void {
    this.showCart = false;
  }

  commander(): void {
    if (!this.isConnected) {
      alert('Veuillez vous connecter avant de commander.');
      return;
    }

    const orderData = {
      client_id: this.clientId,
      plats: this.cartItems.map(item => ({
        idPlat: item.id,
        quantity: item.quantity
      })),
      total: this.getTotal()
    };

    this.http.post(`http://localhost:9010/api/commandes/create`, orderData).subscribe({
      next: () => {
        alert('Commande passée avec succès.');
        localStorage.removeItem('cart');
        this.cartItems = [];
        this.showCart = false;
      },
      error: (err) => {
        alert('Erreur lors de la commande.');
        console.error(err);
      }
    });
  }

  annuler(): void {
    localStorage.removeItem('cart');
    this.cartItems = [];
    this.showCart = false;
  }

  logout(): void {
    sessionStorage.removeItem('clientConnecte');
    localStorage.removeItem('idClient');
    this.isConnected = false;
    this.clientData = null;
    window.location.href = '/login';
  }

  openProfile(): void {
    alert('Ouverture du profil utilisateur.');
    // Tu peux ici ouvrir un popup ou une page de profil
  }
}
