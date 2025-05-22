import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Client } from '../Models/client';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private apiUrl = 'http://localhost:9010/client';

  constructor(private http: HttpClient) {}

  // Inscription
  register(client: Client): Observable<Client> {
    return this.http.post<Client>(`${this.apiUrl}/register`, client, { withCredentials: true });
  }

  // Connexion
  login(email: string, password: string): Observable<string> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }, { responseType: 'text', withCredentials: true });
  }

  // Récupérer client connecté
  getCurrentClient(): Observable<Client | string> {
    return this.http.get<Client | string>(`${this.apiUrl}/me`, { withCredentials: true });
  }

  // Déconnexion
  logout(): Observable<string> {
    return this.http.post(`${this.apiUrl}/logout`, {}, { responseType: 'text', withCredentials: true });
  }
}
