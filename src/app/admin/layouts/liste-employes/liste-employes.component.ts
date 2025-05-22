import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Employe } from '../../Models/employe';
import { EmployeService } from '../../Services/employe.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-liste-employes',
  templateUrl: './liste-employes.component.html',
  styleUrls: ['./liste-employes.component.css']
})
export class ListeEmployesComponent implements OnInit, AfterViewInit {
  employes: Employe[] = [];
  filteredEmployes: Employe[] = [];
  refusForm!: FormGroup;
  refusEmployeId: number | null = null;
  selectedEmploye: Employe | null = null;
  searchTerm: string = '';
  showAll: boolean = true;
  acceptEmployeId: number | null = null;
  isLoading: boolean = false;
  dropdownVisible = false;
  nomEmploye: string = 'Employé';
  employeImageUrl: string = '/assets/default-avatar.png';

  constructor(
    private employeService: EmployeService,
    private fb: FormBuilder,
    private http: HttpClient, private router: Router
  ) {
    this.initForms();
  }

  ngOnInit(): void {
    this.loadEmployes();
    this.chargerDonneesEmploye();
    }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initializeModals();
    }, 100);
  }

  initializeModals(): void {
    console.log('Modals initialized');
  }

  initForms(): void {
    this.refusForm = this.fb.group({
      messageRefus: ['', Validators.required]
    });
  }

  loadEmployes(): void {
    this.isLoading = true;
    this.employeService.listerEmployesEnAttente().subscribe({
      next: (data) => {
        this.employes = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        Swal.fire('Erreur', 'Impossible de charger les employés.', 'error');
      }
    });
  }

  showEnAttenteOnly(): void {
    this.showAll = false;
    this.applyFilters();
  }

  applyFilters(): void {
    let result = [...this.employes];

    if (!this.showAll) {
      result = result.filter(emp => emp.status === 'ATTENTE');
    }

    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const searchLower = this.searchTerm.toLowerCase();
      result = result.filter(emp =>
        emp.nomComplet.toLowerCase().includes(searchLower) ||
        emp.email.toLowerCase().includes(searchLower) ||
        (emp.role && emp.role.toLowerCase().includes(searchLower)) ||
        (emp.telephone && emp.telephone.toLowerCase().includes(searchLower)) ||
        (emp.sexe && emp.sexe.toLowerCase().includes(searchLower))
      );
    }

    this.filteredEmployes = result;
  }

  onSearchChange(event: any): void {
    this.searchTerm = event.target.value;
    this.applyFilters();
  }

  accepterEmploye(id: number): void {
    this.acceptEmployeId = id;
    Swal.fire({
      title: 'Confirmer l\'acceptation',
      text: 'Êtes-vous sûr de vouloir accepter cet employé ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, accepter!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.confirmerAcceptation();
      }
    });
  }

  confirmerAcceptation(): void {
    if (this.acceptEmployeId) {
      this.isLoading = true;
      this.employeService.accepterEmploye(this.acceptEmployeId).subscribe({
        next: () => {
          // Mise à jour de l'employé accepté
          const index = this.employes.findIndex(emp => emp.id === this.acceptEmployeId);
          if (index !== -1) {
            this.employes[index].status = 'ACCEPTE';
            this.applyFilters(); // Réapplique les filtres pour mettre à jour la liste affichée
          }

          this.isLoading = false;

          // Notification de succès
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Employé accepté',
            showConfirmButton: false,
            timer: 1500,
            toast: true
          });

          // Recharge la page après acceptation
          setTimeout(() => {
            window.location.reload(); // Recharge la page
          }, 1500);

          this.acceptEmployeId = null;
        },
        error: () => {
          this.isLoading = false;
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Une erreur est survenue lors de l\'acceptation.'
          });
        }
      });
    }
  }

  refuserEmployeAvecMessage(id: number, message: string): void {
    this.isLoading = true;
    this.employeService.refuserEmploye(id, message).subscribe({
      next: () => {
        // Mise à jour de l'employé refusé
        const index = this.employes.findIndex(emp => emp.id === id);
        if (index !== -1) {
          this.employes[index].status = 'REFUSE';
          this.employes[index].messageRefus = message;
          this.applyFilters(); // Réapplique les filtres pour mettre à jour la liste affichée
        }

        this.isLoading = false;

        // Notification de succès
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Employé refusé',
          showConfirmButton: false,
          timer: 1500,
          toast: true
        });

        // Recharge la page après refus
        setTimeout(() => {
          window.location.reload(); // Recharge la page
        }, 1500);

        this.refusEmployeId = null;
      },
      error: () => {
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur est survenue lors du refus.'
        });
      }
    });
  }

  openRefusModal(id: number): void {
    this.refusEmployeId = id;
    this.refusForm.reset();

    Swal.fire({
      title: 'Refuser un employé',
      input: 'textarea',
      inputLabel: 'Motif du refus',
      inputPlaceholder: 'Veuillez indiquer le motif du refus...',
      showCancelButton: true,
      confirmButtonText: 'Confirmer le refus',
      cancelButtonText: 'Annuler',
      preConfirm: (message) => {
        if (!message) {
          Swal.showValidationMessage('Le motif du refus est requis');
        }
        return { id, message };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.refuserEmployeAvecMessage(result.value.id, result.value.message);
      }
    });
  }

/*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Affiche les détails d'un employé.
   * @param employe Employe dont on souhaite afficher les détails.
   */
/*******  9b844310-aa67-4969-8324-dfc372a954f7  *******/

  showSuccessToast(message: string): void {
    Swal.fire({
      title: 'Succès!',
      text: message,
      icon: 'success',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    });
  }
  showEmployeDetails(employe: Employe): void {
  this.selectedEmploye = employe;

  const initiales = `${employe.nomComplet?.charAt(0) || ''}`;

  // Déterminer le statut avec le bon format et couleur
  let statusClass = 'background-color: #FEF3C7; color: #92400E;';
  let statusText = 'En attente';

  if (employe.status === 'ACCEPTE') {
    statusClass = 'background-color: #D1FAE5; color: #065F46;';
    statusText = 'Accepté';
  } else if (employe.status === 'REFUSE') {
    statusClass = 'background-color: #FEE2E2; color: #991B1B;';
    statusText = 'Refusé';
  }

  Swal.fire({
    html: `
      <div class="modal" style="width: 100%; animation: slideUp 0.4s ease-out;">
        <div class="modal-header" style="background: linear-gradient(135deg, #6366F1, #8B5CF6); color: white; padding: 20px; position: relative;">
          <h2 class="modal-title" style="margin: 0; font-size: 24px; font-weight: 600;">Détails de l'employé</h2>
        </div>
        <div class="modal-content" style="padding: 20px;">
          <div class="employee-info" style="display: flex; align-items: center; margin-bottom: 25px;">
            <div class="employee-avatar" style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #9333EA, #4F46E5); display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: bold; margin-right: 20px;">
              ${initiales}
            </div>
            <div class="employee-details">
              <h3 style="margin: 0 0 5px 0; font-size: 20px; color: #111827;">${employe.nomComplet}</h3>
              <span class="employee-status" style="display: inline-block; padding: 4px 12px; ${statusClass} border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase;">${statusText}</span>
            </div>
          </div>

          <div class="info-list" style="margin-top: 20px;">
            <!-- Information personnelle -->
            <div class="info-item" style="padding: 12px 0; border-bottom: 1px solid #E5E7EB; display: flex; align-items: center;">
              <div class="info-icon" style="width: 36px; height: 36px; background-color: #EFF6FF; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 15px; color: #3B82F6;">
                ✉️
              </div>
              <div class="info-content" style="flex-grow: 1;">
                <div class="info-label" style="font-size: 12px; color: #6B7280; margin-bottom: 2px;">Email</div>
                <div class="info-value" style="font-size: 16px; color: #1F2937; font-weight: 500;">${employe.email}</div>
              </div>
            </div>

            <div class="info-item" style="padding: 12px 0; border-bottom: 1px solid #E5E7EB; display: flex; align-items: center;">
              <div class="info-icon" style="width: 36px; height: 36px; background-color: #EFF6FF; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 15px; color: #3B82F6;">
                📱
              </div>
              <div class="info-content" style="flex-grow: 1;">
                <div class="info-label" style="font-size: 12px; color: #6B7280; margin-bottom: 2px;">Téléphone</div>
                <div class="info-value" style="font-size: 16px; color: #1F2937; font-weight: 500;">${employe.telephone || 'Non renseigné'}</div>
              </div>
            </div>

            <!-- Informations professionnelles -->
            <div class="info-item" style="padding: 12px 0; border-bottom: 1px solid #E5E7EB; display: flex; align-items: center;">
              <div class="info-icon" style="width: 36px; height: 36px; background-color: #EFF6FF; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 15px; color: #3B82F6;">
                👨‍💼
              </div>
              <div class="info-content" style="flex-grow: 1;">
                <div class="info-label" style="font-size: 12px; color: #6B7280; margin-bottom: 2px;">Poste</div>
                <div class="info-value" style="font-size: 16px; color: #1F2937; font-weight: 500;">${employe.role || 'Non renseigné'}</div>
              </div>
            </div>

            <div class="info-item" style="padding: 12px 0; border-bottom: 1px solid #E5E7EB; display: flex; align-items: center;">
              <div class="info-icon" style="width: 36px; height: 36px; background-color: #EFF6FF; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 15px; color: #3B82F6;">
                👤
              </div>
              <div class="info-content" style="flex-grow: 1;">
                <div class="info-label" style="font-size: 12px; color: #6B7280; margin-bottom: 2px;">Sexe</div>
                <div class="info-value" style="font-size: 16px; color: #1F2937; font-weight: 500;">${employe.sexe || 'Non renseigné'}</div>
              </div>
            </div>

            <!-- Informations contractuelles -->
            ${employe.salaireParJour ? `
              <div class="info-item" style="padding: 12px 0; border-bottom: 1px solid #E5E7EB; display: flex; align-items: center;">
                <div class="info-icon" style="width: 36px; height: 36px; background-color: #EFF6FF; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 15px; color: #3B82F6;">
                  💰
                </div>
                <div class="info-content" style="flex-grow: 1;">
                  <div class="info-label" style="font-size: 12px; color: #6B7280; margin-bottom: 2px;">Salaire par jour</div>
                  <div class="info-value" style="font-size: 16px; color: #1F2937; font-weight: 500;">${employe.salaireParJour} DT</div>
                </div>
              </div>
            ` : ''}

            ${employe.heurTolererDeRetard !== undefined ? `
              <div class="info-item" style="padding: 12px 0; border-bottom: 1px solid #E5E7EB; display: flex; align-items: center;">
                <div class="info-icon" style="width: 36px; height: 36px; background-color: #EFF6FF; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 15px; color: #3B82F6;">
                  ⏱️
                </div>
                <div class="info-content" style="flex-grow: 1;">
                  <div class="info-label" style="font-size: 12px; color: #6B7280; margin-bottom: 2px;">Heures tolérées de retard</div>
                  <div class="info-value" style="font-size: 16px; color: #1F2937; font-weight: 500;">${employe.heurTolererDeRetard} heure(s)</div>
                </div>
              </div>
            ` : ''}

            <!-- Message de refus (si applicable) -->
            ${employe.status === 'REFUSE' && employe.messageRefus ? `
              <div class="info-item" style="padding: 12px 0; display: flex; align-items: center;">
                <div class="info-icon" style="width: 36px; height: 36px; background-color: #FECACA; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 15px; color: #B91C1C;">
                  ⚠️
                </div>
                <div class="info-content" style="flex-grow: 1;">
                  <div class="info-label" style="font-size: 12px; color: #6B7280; margin-bottom: 2px;">Motif du refus</div>
                  <div class="info-value" style="font-size: 16px; color: #991B1B; font-weight: 500;">${employe.messageRefus}</div>
                </div>
              </div>
            ` : ''}
          </div>
        </div>
        <style>
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .swal2-popup {
            border-radius: 12px;
            padding: 0;
            width: 400px;
          }

          .swal2-close {
            position: absolute;
            top: 15px;
            right: 15px;
            background: rgba(255, 255, 255, 0.2);
            border: none;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s;
            color: white;
            font-size: 20px;
          }

          .swal2-close:hover {
            background: rgba(255, 255, 255, 0.4);
            transform: scale(1.1);
          }

          .swal2-actions {
            display: flex;
            justify-content: flex-end;
            padding: 20px;
            background-color: #F9FAFB;
            border-top: 1px solid #E5E7EB;
            margin: 0;
          }

          .swal2-styled.swal2-confirm {
            background: linear-gradient(135deg, #6366F1, #8B5CF6);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s;
          }

          .swal2-styled.swal2-confirm:hover {
            box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.4);
          }

          .swal2-styled.swal2-cancel {
            border: 1px solid #D1D5DB;
            color: #4B5563;
            background-color: white;
            margin-right: 10px;
            padding: 10px 20px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s;
          }

          .swal2-styled.swal2-cancel:hover {
            background-color: #F3F4F6;
          }
        </style>
      </div>
    `,
    showCloseButton: true,
    showCancelButton: employe.status === 'ATTENTE',
    showConfirmButton: employe.status === 'ATTENTE',
    confirmButtonText: 'Confirmer',
    cancelButtonText: 'Annuler',
    buttonsStyling: true,
    customClass: {
      closeButton: 'modal-close-button',
      confirmButton: 'btn-primary',
      cancelButton: 'btn-outline',
      actions: 'modal-footer'
    },
    width: '400px',
    padding: 0,
    background: 'white',
    showClass: {
      popup: 'animated fadeIn'
    }
  }).then((result) => {
  if (result.isConfirmed && employe.status === 'ATTENTE') {
    if (employe.id) {
      this.accepterEmploye(employe.id);
    }
  } else if (result.dismiss === Swal.DismissReason.cancel && employe.status === 'ATTENTE') {
    if (employe.id !== undefined) {
      this.openRefusModal(employe.id);
    }
  }
});
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
