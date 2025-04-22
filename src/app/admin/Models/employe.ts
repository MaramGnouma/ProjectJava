// src/app/models/employe.model.ts
export class Employe {
  constructor(
    public id: number,
    public nomComplet: string,
    public email: string,
    public status: string,
    public telephone?: string,
    public role?: string,
    public sexe?: string,
    public messageRefus?: string,
    public salaireParJour?: number,
    public heurTolererDeRetard?: number,
    public password?: string
  ) {}

}
