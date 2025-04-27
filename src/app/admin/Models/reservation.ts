// src/app/models/reservation.model.ts
export class Reservation {
  constructor(
    public nomClient: string,
    public prenomClient: string,
    public dateHeure?: string
  ) {}
}
