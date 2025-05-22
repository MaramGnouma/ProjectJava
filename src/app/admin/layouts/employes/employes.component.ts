import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Employe } from '../../Models/employe';
import { EmployeService } from '../../Services/employe.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employes',
  templateUrl: './employes.component.html',
  styleUrls: ['./employes.component.css']
})
export class EmployesComponent implements OnInit {

  employeAModifier: Employe | null = null;
  isAddModalOpen = false;
  isModModalOpen = false;

  employes: Employe[] = [];

  // initialisation du nouvel employé
  nouveauEmploye: Employe = {
    nomComplet: '',
    telephone: '',
    sexe: '',
    email: '',
    role: 'SERVEUR', // valeur par défaut possible
    password: '',
    salaireParJour: 0,
    heurTolererDeRetard: 0,
    status: 'ACCEPTE', // statut par défaut
    messageRefus: ''
  };
 dropdownVisible = false;
    nomEmploye: string = 'Employé';
    employeImageUrl: string = '/assets/default-avatar.png';
  constructor(private employeService: EmployeService,private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.chargerEmployes();
     this.chargerDonneesEmploye();

  }

  // Méthode pour ouvrir le formulaire d'ajout avec SweetAlert
  ouvrirFormAjout(): void {
    Swal.fire({
      title: 'Ajouter un Employé',
      html: `
        <div class="swal-form">
          <div class="swal-form-group">
            <label for="nomComplet">Nom Complet</label>
            <input id="nomComplet" type="text" class="swal2-input" placeholder="Nom complet">
          </div>
          <div class="swal-form-group">
            <label for="telephone">Téléphone</label>
            <input id="telephone" type="text" class="swal2-input" placeholder="Téléphone">
          </div>
          <div class="swal-form-group">
            <label for="sexe">Sexe</label>
            <select id="sexe" class="swal2-input">
              <option value="" disabled selected>Choisir sexe</option>
              <option value="Homme">Homme</option>
              <option value="Femme">Femme</option>
            </select>
          </div>
          <div class="swal-form-group">
            <label for="email">Email</label>
            <input id="email" type="email" class="swal2-input" placeholder="Email">
          </div>
          <div class="swal-form-group">
            <label for="role">Rôle</label>
            <select id="role" class="swal2-input">
              <option value="CHEF">Chef</option>
              <option value="SERVEUR" selected>Serveur</option>
              <option value="CAISSIER">Caissier</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div class="swal-form-group">
            <label for="salaireParJour">Salaire par jour</label>
            <input id="salaireParJour" type="number" class="swal2-input" placeholder="Salaire par jour">
          </div>
          <div class="swal-form-group">
            <label for="heureTolererDeRetard">Heure tolérée de retard</label>
            <input id="heureTolererDeRetard" type="number" class="swal2-input" placeholder="Heure tolérée de retard">
          </div>
          <div class="swal-form-group">
            <label for="password">Mot de passe</label>
            <input id="password" type="password" class="swal2-input" placeholder="Mot de passe">
          </div>
          <div class="swal-form-group">
            <label for="status">Status</label>
            <select id="status" class="swal2-input">
              <option value="ACCEPTE" selected>Accepté</option>
              <option value="REFUSE">Refusé</option>
              <option value="ATTENTE">En attente</option>
            </select>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Ajouter',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#4CAF50',
      cancelButtonColor: '#d33',
      focusConfirm: false,
      customClass: {
        container: 'swal-wide',
        popup: 'swal-wide-popup'
      },
      preConfirm: () => {
        const nomComplet = (document.getElementById('nomComplet') as HTMLInputElement).value;
        const telephone = (document.getElementById('telephone') as HTMLInputElement).value;
        const sexe = (document.getElementById('sexe') as HTMLSelectElement).value;
        const email = (document.getElementById('email') as HTMLInputElement).value;
        const role = (document.getElementById('role') as HTMLSelectElement).value;
        const salaireParJour = (document.getElementById('salaireParJour') as HTMLInputElement).value;
        const heureTolererDeRetard = (document.getElementById('heureTolererDeRetard') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;
        const status = (document.getElementById('status') as HTMLSelectElement).value;

        // Validation basique
        if (!nomComplet || !telephone || !sexe || !email || !role || !salaireParJour || !password) {
          Swal.showValidationMessage('Veuillez remplir tous les champs obligatoires');
          return false;
        }

        return {
          nomComplet,
          telephone,
          sexe,
          email,
          role,
          salaireParJour: parseFloat(salaireParJour),
          heureTolererDeRetard: parseFloat(heureTolererDeRetard) || 0,
          password,
          status
        };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.nouveauEmploye = result.value as Employe;
        this.ajouter();
      }
    });
  }

  // Méthode pour ouvrir le formulaire de modification avec SweetAlert
  ouvrirFormModification(employe: Employe): void {
    this.employeAModifier = { ...employe };

    Swal.fire({
      title: 'Modifier un Employé',
      html: `
        <div class="swal-form">
          <div class="swal-form-group">
            <label for="nomComplet">Nom Complet</label>
            <input id="nomComplet" type="text" class="swal2-input" value="${employe.nomComplet || ''}">
          </div>
          <div class="swal-form-group">
            <label for="telephone">Téléphone</label>
            <input id="telephone" type="text" class="swal2-input" value="${employe.telephone || ''}">
          </div>
          <div class="swal-form-group">
            <label for="sexe">Sexe</label>
            <select id="sexe" class="swal2-input">
              <option value="Homme" ${employe.sexe === 'Homme' ? 'selected' : ''}>Homme</option>
              <option value="Femme" ${employe.sexe === 'Femme' ? 'selected' : ''}>Femme</option>
            </select>
          </div>
          <div class="swal-form-group">
            <label for="email">Email</label>
            <input id="email" type="email" class="swal2-input" value="${employe.email || ''}">
          </div>
          <div class="swal-form-group">
            <label for="role">Rôle</label>
            <select id="role" class="swal2-input">
              <option value="CHEF" ${employe.role === 'CHEF' ? 'selected' : ''}>Chef</option>
              <option value="SERVEUR" ${employe.role === 'SERVEUR' ? 'selected' : ''}>Serveur</option>
              <option value="CAISSIER" ${employe.role === 'CAISSIER' ? 'selected' : ''}>Caissier</option>
              <option value="ADMIN" ${employe.role === 'ADMIN' ? 'selected' : ''}>Admin</option>
            </select>
          </div>
          <div class="swal-form-group">
            <label for="salaireParJour">Salaire par jour</label>
            <input id="salaireParJour" type="number" class="swal2-input" value="${employe.salaireParJour || 0}">
          </div>
          <div class="swal-form-group">
            <label for="heureTolererDeRetard">Heure tolérée de retard</label>
            <input id="heureTolererDeRetard" type="number" class="swal2-input" value="${employe.heurTolererDeRetard || 0}">
          </div>
          <div class="swal-form-group">
            <label for="status">Status</label>
            <select id="status" class="swal2-input">
              <option value="ACCEPTE" ${employe.status === 'ACCEPTE' ? 'selected' : ''}>Accepté</option>
              <option value="REFUSE" ${employe.status === 'REFUSE' ? 'selected' : ''}>Refusé</option>
              <option value="ATTENTE" ${employe.status === 'ATTENTE' ? 'selected' : ''}>En attente</option>
            </select>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Modifier',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#4CAF50',
      cancelButtonColor: '#d33',
      focusConfirm: false,
      customClass: {
        container: 'swal-wide',
        popup: 'swal-wide-popup'
      },
      preConfirm: () => {
        const nomComplet = (document.getElementById('nomComplet') as HTMLInputElement).value;
        const telephone = (document.getElementById('telephone') as HTMLInputElement).value;
        const sexe = (document.getElementById('sexe') as HTMLSelectElement).value;
        const email = (document.getElementById('email') as HTMLInputElement).value;
        const role = (document.getElementById('role') as HTMLSelectElement).value;
        const salaireParJour = (document.getElementById('salaireParJour') as HTMLInputElement).value;
        const heureTolererDeRetard = (document.getElementById('heureTolererDeRetard') as HTMLInputElement).value;
        const status = (document.getElementById('status') as HTMLSelectElement).value;

        // Validation basique
        if (!nomComplet || !telephone || !sexe || !email || !role || !salaireParJour) {
          Swal.showValidationMessage('Veuillez remplir tous les champs obligatoires');
          return false;
        }

        return {
          id: employe.id,
          nomComplet,
          telephone,
          sexe,
          email,
          role,
          salaireParJour: parseFloat(salaireParJour),
          heureTolererDeRetard: parseFloat(heureTolererDeRetard) || 0,
          password: employe.password, // Conserver le mot de passe existant
          status
        };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.employeAModifier = result.value as Employe;
        this.modifier(this.employeAModifier);
      }
    });
  }

  openModal(modalId: string) {
    if (modalId === 'addEmployee') {
      this.isAddModalOpen = true;
    } else if (modalId === 'modEmployee') {
      this.isModModalOpen = true;
    }
  }

  closeModal(modalId: string) {
    if (modalId === 'addEmployee') {
      this.isAddModalOpen = false;
    }
  }

  closeModal1(modalId: string) {
    // S'assurer que la modale est bien fermée visuellement
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('show');
    }

    // Réinitialiser tous les états liés à la modale
    this.isModModalOpen = false;
    this.employeAModifier = null; // vide l'objet pour que l'étiquette flottante disparaisse
  }

  chargerEmployes(): void {
    this.employeService.listerEmployesAcceptes().subscribe(data => {
      this.employes = data;
    });
  }

  ajouter(): void {
    this.employeService.add(this.nouveauEmploye).subscribe({
      next: () => {
        this.chargerEmployes();
        this.nouveauEmploye = {
          nomComplet: '',
          telephone: '',
          sexe: '',
          email: '',
          role: 'SERVEUR',
          password: '',
          salaireParJour: 0,
          heurTolererDeRetard: 0,
          status: 'ATTENTE',
          messageRefus: ''
        };

        // Afficher un message de succès
        Swal.fire({
          icon: 'success',
          title: 'Succès!',
          text: 'Employé ajouté avec succès',
          confirmButtonColor: '#4CAF50'
        });
      },
      error: (err) => {
        // Vérifier si l'erreur est due à un email existant
        if (err.status === 400 && err.error && err.error.message && err.error.message.includes('email')) {
          Swal.fire({
            icon: 'error',
            title: 'Erreur!',
            text: 'Cet email existe déjà dans la base de données',
            confirmButtonColor: '#d33'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Erreur!',
            text: 'Une erreur est survenue lors de l\'ajout de l\'employé',
            confirmButtonColor: '#d33'
          });
        }
      }
    });
  }

  supprimer(id: number): void {
    // Confirmation avant suppression
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: 'Cette action est irréversible!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.employeService.delete(id).subscribe({
          next: () => {
            this.chargerEmployes();
            Swal.fire({
              icon: 'success',
              title: 'Supprimé!',
              text: 'L\'employé a été supprimé avec succès.',
              confirmButtonColor: '#4CAF50'
            });
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Erreur!',
              text: 'Une erreur est survenue lors de la suppression.',
              confirmButtonColor: '#d33'
            });
          }
        });
      }
    });
  }

  modifier(employe: Employe): void {
    if (employe.id) {
      this.employeService.update(employe.id, employe).subscribe({
        next: () => {
          this.chargerEmployes();              // recharge la liste
          this.employeAModifier = null;        // nettoie l'objet pour éviter les bugs

          // Afficher un message de succès
          Swal.fire({
            icon: 'success',
            title: 'Succès!',
            text: 'Employé modifié avec succès',
            confirmButtonColor: '#4CAF50'
          });
        },
        error: (err) => {
          // Vérifier si l'erreur est due à un email existant
          if (err.status === 400 && err.error && err.error.message && err.error.message.includes('email')) {
            Swal.fire({
              icon: 'error',
              title: 'Erreur!',
              text: 'Cet email existe déjà dans la base de données',
              confirmButtonColor: '#d33'
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Erreur!',
              text: 'Une erreur est survenue lors de la modification de l\'employé',
              confirmButtonColor: '#d33'
            });
          }
        }
      });
    }
  }

  ouvrirModif(employe: Employe): void {
    this.employeAModifier = { ...employe }; // on clone pour éviter de modifier directement la liste
    this.ouvrirFormModification(employe);
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
