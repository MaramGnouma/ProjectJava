import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TableRestaurant } from '../Models/table-restaurant';
import { AuthService } from './auth.service';

export interface Reservation {
  nomClient: string;
  prenomClient: string;
  dateHeure?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TableserviceService {
  private apiUrl = 'http://localhost:9010/tables';

  constructor(private http: HttpClient,private authService: AuthService) {}

 private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
  getTables(): Observable<TableRestaurant[]> {
      return this.http.get<TableRestaurant[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  createTable(table: Partial<TableRestaurant>): Observable<TableRestaurant> {
    return this.http.post<TableRestaurant>(this.apiUrl, table, { headers: this.getHeaders() });
  }

  updateTable(id: number, table: Partial<TableRestaurant>): Observable<TableRestaurant> {
    return this.http.put<TableRestaurant>(`${this.apiUrl}/${id}`, table, { headers: this.getHeaders() });
  }

  deleteTable(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  reserveTable(id: number, reservation: Reservation): Observable<TableRestaurant> {
    return this.http.post<TableRestaurant>(`${this.apiUrl}/${id}/reserve`, reservation, { headers: this.getHeaders() });
  }

  confirmReservation(id: number): Observable<TableRestaurant> {
    return this.http.put<TableRestaurant>(`${this.apiUrl}/${id}/confirm`, {}, { headers: this.getHeaders() });
  }

  cancelReservation(id: number): Observable<TableRestaurant> {
    return this.http.put<TableRestaurant>(`${this.apiUrl}/${id}/cancel`, {}, { headers: this.getHeaders() });
  }
}
