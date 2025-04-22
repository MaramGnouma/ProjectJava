import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { Employe } from "../Models/employe";

@Injectable({
  providedIn: 'root'
})
export class EmployeService {
  private apiUrl = 'http://localhost:9010/api/employes';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  listerTousEmployes(): Observable<Employe[]> {
    return this.http.get<Employe[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  ajouterEmploye(employe: Employe): Observable<Employe> {
    return this.http.post<Employe>(`${this.apiUrl}/ajouter`, employe, { headers: this.getHeaders() });
  }

  modifierEmploye(id: number, employe: Employe): Observable<Employe> {
    return this.http.put<Employe>(`${this.apiUrl}/${id}`, employe, { headers: this.getHeaders() });
  }

  supprimerEmploye(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  accepterEmploye(id: number): Observable<Employe> {
    return this.http.put<Employe>(`${this.apiUrl}/accepter/${id}`, {}, { headers: this.getHeaders() });
  }

  refuserEmploye(id: number, message: string): Observable<Employe> {
    return this.http.put<Employe>(`${this.apiUrl}/refuser/${id}`, { message }, { headers: this.getHeaders() });
  }

  listerEmployesAcceptes(): Observable<Employe[]> {
    return this.http.get<Employe[]>(`${this.apiUrl}/acceptes`, { headers: this.getHeaders() });
  }

  listerEmployesRefuses(): Observable<Employe[]> {
    return this.http.get<Employe[]>(`${this.apiUrl}/refuses`, { headers: this.getHeaders() });
  }

  listerEmployesEnAttente(): Observable<Employe[]> {
    console.log('Token utilisé:', this.authService.getToken());
    return this.http.get<Employe[]>(`${this.apiUrl}/enattente`, { headers: this.getHeaders() });
  }
}
