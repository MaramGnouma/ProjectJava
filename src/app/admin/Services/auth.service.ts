// 1. Créer un service d'authentification (auth.service.ts)
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:9010/api/personnes';
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient) { }

  // Connexion et stockage du token
  signin(credentials: {email: string, password: string}): Observable<any> {
    return this.http.post<{token: string}>(`${this.apiUrl}/signin`, credentials)
      .pipe(
        tap(response => {
          if (response && response.token) {
            this.setToken(response.token);
          }
        })
      );
  }

  // Stockage du token dans localStorage
  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }
 signup(formData: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/signup`, formData);
}
  // Récupération du token stocké
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Vérifier si utilisateur est connecté
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Déconnexion
  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }
}
