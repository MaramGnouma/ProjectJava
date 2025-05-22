import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TableRestaurant } from '../../Models/table-restaurant';
import {TableserviceService } from '../../Services/table.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-table-restaurant',
  templateUrl: './table-restaurant.component.html',
  styleUrls: ['./table-restaurant.component.css']
})
export class TableRestaurantComponent {
  tables: TableRestaurant[] = [];
  selectedTable: TableRestaurant | null = null;
  createForm: FormGroup;
  editForm: FormGroup;
   dropdownVisible = false;
  nomEmploye: string = 'Employé';
  employeImageUrl: string = '/assets/default-avatar.png';

  constructor(
    private tableservice: TableserviceService,
    private fb: FormBuilder,
    private http: HttpClient, private router: Router
  ) {
    this.createForm = this.fb.group({
      capacite: [1],
      emplacement: ['INTERIEUR']
    });
    this.editForm = this.fb.group({
      capacite: [1],
      emplacement: ['INTERIEUR']
    });
  }

  ngOnInit() {
    this.loadTables();
    this.chargerDonneesEmploye();

  }

  loadTables() {
    this.tableservice.getTables().subscribe(data => this.tables = data);
  }

  onCreateTable() {
    if (this.createForm.valid) {
      this.tableservice.createTable(this.createForm.value).subscribe(() => {
        this.createForm.reset({ capacite: 1, emplacement: 'INTERIEUR' });
        this.loadTables();
      });
    }
  }

  onEditTable(table: TableRestaurant) {
    this.selectedTable = table;
    this.editForm.patchValue({
      capacite: table.capacite,
      emplacement: table.emplacement
    });
  }

  onUpdateTable() {
    if (this.selectedTable && this.editForm.valid) {
      this.tableservice.updateTable(this.selectedTable.id, this.editForm.value).subscribe(() => {
        this.selectedTable = null;
        this.loadTables();
      });
    }
  }

  onDeleteTable(id: number | undefined) {
    if (id && confirm('Confirmer la suppression ?')) {
      this.tableservice.deleteTable(id).subscribe(() => this.loadTables());
    }
  }

  confirmReservation(id: number | undefined) {
    if (id) {
      this.tableservice.confirmReservation(id).subscribe(() => this.loadTables());
    }
  }

  statutColor(statut: string) {
    switch (statut) {
      case 'LIBRE': return 'green';
      case 'EN_ATTENTE': return 'orange';
      case 'RESERVER': return 'red';
      default: return '';
    }
  }
   chargerDonneesEmploye() {
      try {
        // Récupération des données depuis le sessionStorage
        const empData = sessionStorage.getItem('emp');
        console.log('Données brutes récupérées du sessionStorage:', empData);

        if (empData) {
          // Conversion des données JSON en objet JavaScript
          const emp = JSON.parse(empData);
          console.log('Données employé parsées:', emp);

          // Mise à jour des propriétés du composant avec les données de l'employé
          // Utilisation de nomComplet ou nom_complet selon ce qui est disponible
          this.nomEmploye = emp.nomComplet || emp.nom_complet || 'Employé';

          // L'image n'est pas dans le token JWT, on utilise une image par défaut
          this.employeImageUrl = emp.image_employe || '../../../../assets/9703596.png';

          console.log('Nom employé défini:', this.nomEmploye);
          console.log('URL image employé définie:', this.employeImageUrl);
        } else {
          console.warn('Aucune donnée employé trouvée dans le sessionStorage');
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données employé:', error);
      }
    }

    toggleDropdown() {
      this.dropdownVisible = !this.dropdownVisible;
    }

    /**
     * Déconnecte l'utilisateur et redirige vers la page de connexion
     */
    logout(event?: Event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
            sessionStorage.removeItem('emp');
            this.router.navigate(['/admin/signin']);
          }



    /**
     * Affiche un pop-up avec les détails de l'employé connecté
     */
    showProfilEmploye(event?: Event) {
      // Empêcher le comportement par défaut du lien
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      try {
        // Récupération des données employé depuis le sessionStorage
        const empData = sessionStorage.getItem('emp');
        console.log('Données brutes pour le popup:', empData);

        if (!empData) {
          this.afficherErreurPopup('Données employé non disponibles');
          return;
        }

        const emp = JSON.parse(empData);
        console.log('Données employé pour le popup:', emp);

        // Affichage du pop-up avec SweetAlert2
        Swal.fire({
          title: 'Détails de l\'employé',
          html: `
            <div style="text-align: center; font-size: 16px">
              <img src="../../../../assets/9703596.png" alt="Photo"
                   style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin-bottom: 10px;" />

              <div style="text-align: left; display: grid; grid-template-columns: auto auto; gap: 10px; margin-top: 20px;">
                <div style="font-weight: bold; color: #666;">Nom complet:</div>
                <div>${emp.nomComplet || emp.nom_complet || 'Non spécifié'}</div>

                <div style="font-weight: bold; color: #666;">Email:</div>
                <div>${emp.email || 'Non spécifié'}</div>

                <div style="font-weight: bold; color: #666;">Rôle:</div>
                <div>${emp.role || 'Non spécifié'}</div>

                <div style="font-weight: bold; color: #666;">Statut:</div>
                <div>${emp.status || 'Non spécifié'}</div>
              </div>
            </div>
          `,
          showCloseButton: true,
          confirmButtonText: 'Fermer',
          confirmButtonColor: '#d68e2d',
          width: '600px',
          padding: '20px',
          background: '#fff',
          timerProgressBar: false,
          allowOutsideClick: false,
          allowEscapeKey: true,
          customClass: {
            title: 'custom-swal-title',
            confirmButton: 'custom-swal-button',
            popup: 'custom-swal-popup'
          }
        }).then((result) => {
          console.log('Popup fermée', result);
        });
      } catch (error) {
        console.error('Erreur lors de l\'affichage du profil:', error);
        this.afficherErreurPopup('Une erreur est survenue lors de l\'affichage du profil');
      }
    }

    /**
     * Affiche un pop-up d'erreur
     */
    private afficherErreurPopup(message: string) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: message,
        confirmButtonColor: '#d68e2d'
      });
    }
}
