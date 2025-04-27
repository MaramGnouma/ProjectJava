import { Component, OnInit } from '@angular/core';
import { Employe } from '../../Models/employe';
import { EmployeService } from '../../Services/employe.service';

@Component({
  selector: 'app-employes',
  templateUrl: './employes.component.html',
  styleUrls: ['./employes.component.css']
})
export class EmployesComponent implements OnInit {

  employeAModifier: Employe | null = null;
  employes: Employe[] = [];
  nouveauEmploye: Employe = {
    nomComplet: '',
    telephone: '',
    sexe: '',
    email: '',
    role: '',
    id: 0,
    status: 'ACCEPTER' // Ajout du statut par défaut
  };

  constructor(private employeService: EmployeService) {}

  ngOnInit(): void {
    this.chargerEmployes();
  }

  chargerEmployes(): void {
    this.employeService.getAll().subscribe(data => {
      this.employes = data;
    });
  }

  ajouter(): void {
    if (this.nouveauEmploye.nomComplet && this.nouveauEmploye.telephone && this.nouveauEmploye.email) {
      this.employeService.add(this.nouveauEmploye).subscribe(() => {
        this.chargerEmployes();
        // Réinitialiser les champs après ajout
        this.nouveauEmploye = { nomComplet: '', telephone: '', sexe: '', email: '', role: '', id: 0, status: 'Accepter' };
      });
    } else {
      alert('Veuillez remplir tous les champs obligatoires.');
    }
  }

  supprimer(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) {
      this.employeService.delete(id).subscribe(() => {
        this.chargerEmployes();
      });
    }
  }

  modifier(employe: Employe): void {
    if (employe.id) {
      this.employeService.update(employe.id, employe).subscribe(() => {
        this.chargerEmployes();
        this.employeAModifier = null; // Fermer la fenêtre de modification après envoi
      });
    }
  }

  ouvrirModif(employe: Employe): void {
    this.employeAModifier = { ...employe }; // Cloner l'employé pour éviter de modifier directement la liste
  }

}
