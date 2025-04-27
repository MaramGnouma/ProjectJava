import { Reservation } from "./reservation";

// src/app/models/table-restaurant.model.ts
export class TableRestaurant {
  constructor(
    public id: number,
    public capacite: number,
    public statut: string,
    public emplacement?: string,
    public reservation?: Reservation
  ) {}
}
