export class Employe {
  constructor(
    public nomComplet: string,
    public email: string,
    public status: 'ACCEPTE' | 'REFUSE' | 'ATTENTE',
    public telephone?: string,
    public role?: string,
    public sexe?: string,
    public messageRefus?: string,
    public salaireParJour?: number,
    public heurTolererDeRetard?: number,
    public password?: string,
    public id?: number
  ) {}
}
