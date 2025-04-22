import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-headerclient',
  templateUrl: './headerclient.component.html',
  styleUrls: ['./headerclient.component.css']
})
export class HeaderclientComponent implements OnInit, AfterViewInit {

  isConnected = false;  // Simuler l'état : faux = pas connecté

  ngOnInit(): void {
    // Ici plus besoin de showCorrectPopup(), l'affichage se gère au clic sur profileBtn
  }

  ngAfterViewInit(): void {
    this.setupMenuToggle();
    this.setupDropdown();
    this.setupProfileClickHandler(); // Renommé car plus logique
    this.setupOutsideClickHandlers();
  }

   setupMenuToggle(): void {
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');

    if (navToggle) {
      navToggle.addEventListener('click', () => navMenu?.classList.add('show-menu'));
    }

    if (navClose) {
      navClose.addEventListener('click', () => navMenu?.classList.remove('show-menu'));
    }

    document.querySelectorAll('.nav__link').forEach(link =>
      link.addEventListener('click', () => navMenu?.classList.remove('show-menu'))
    );
  }

   setupDropdown(): void {
    const dropdown = document.getElementById('dropdown');
    dropdown?.addEventListener('click', () => {
      dropdown.classList.toggle('show-dropdown');
    });
  }

   setupProfileClickHandler(): void {
    const profileBtn = document.getElementById('profileBtn');
    profileBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      this.showCorrectPopup();
    });
  }

   setupOutsideClickHandlers(): void {
    window.addEventListener('click', (event) => {
      const profilePopup = document.getElementById('profilePopup');
      const notConnectedPopup = document.getElementById('notConnectedPopup');

      if (event.target === profilePopup) {
        this.closeProfilePopup();
      }

      if (event.target === notConnectedPopup) {
        this.closeNotConnectedPopup();
      }
    });
  }

   showCorrectPopup(): void {
    if (this.isConnected) {
      this.openProfilePopup();
    } else {
      this.openNotConnectedPopup();
    }
  }

   openProfilePopup(): void {
    const profilePopup = document.getElementById('profilePopup');
    if (profilePopup) {
      profilePopup.style.display = 'flex';
    }
  }

   closeProfilePopup(): void {
    const profilePopup = document.getElementById('profilePopup');
    if (profilePopup) {
      profilePopup.style.display = 'none';
    }
  }

   openNotConnectedPopup(): void {
    const notConnectedPopup = document.getElementById('notConnectedPopup');
    if (notConnectedPopup) {
      notConnectedPopup.style.display = 'flex';
    }
  }

   closeNotConnectedPopup(): void {
    const popup = document.getElementById('notConnectedPopup');
    if (popup) popup.style.display = 'none';
  }
}
