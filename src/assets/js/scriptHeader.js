    /*=============== SHOW MENU ===============*/
    const navMenu = document.getElementById('nav-menu'),
    navToggle = document.getElementById('nav-toggle'),
    navClose = document.getElementById('nav-close')

/* Menu show */
if(navToggle){
 navToggle.addEventListener('click', () =>{
    navMenu.classList.add('show-menu')
 })
}

/* Menu hidden */
if(navClose){
 navClose.addEventListener('click', () =>{
    navMenu.classList.remove('show-menu')
 })
}

/*=============== REMOVE MENU MOBILE ===============*/
const navLink = document.querySelectorAll('.nav__link')

const linkAction = () =>{
 const navMenu = document.getElementById('nav-menu')
 // When we click on each nav__link, we remove the show-menu class
 navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*=============== SHOW DROPDOWN ===============*/
const showDropdown = (dropdownId) =>{
 const dropdown = document.getElementById(dropdownId)

 dropdown.addEventListener('click', ()=>{
    /* Show dropdown */
    dropdown.classList.toggle('show-dropdown')
 })
}
showDropdown('dropdown')
/*=============== PROFILE POPUP FUNCTIONS ===============*/
    // Function to open profile popup
    function openProfilePopup() {
       document.getElementById('profilePopup').style.display = 'flex';
    }

    // Function to close profile popup
    function closeProfilePopup() {
       document.getElementById('profilePopup').style.display = 'none';
    }

    // Add event listener to the profile link in the dropdown
    document.addEventListener('DOMContentLoaded', function() {
       const profileBtn = document.getElementById('profileBtn');
       if (profileBtn) {
          profileBtn.addEventListener('click', function(e) {
             e.preventDefault();
             openProfilePopup();
          });
       }
    });

    // Close popup if clicked outside the content
    window.addEventListener('click', function(event) {
       const popup = document.getElementById('profilePopup');
       if (event.target === popup) {
          closeProfilePopup();
       }
    });
    function openNotConnectedPopup() {
 document.getElementById('notConnectedPopup').style.display = 'flex';
}

function closeNotConnectedPopup() {
 document.getElementById('notConnectedPopup').style.display = 'none';
}

// Fermer si on clique en dehors du contenu
window.addEventListener('click', function(event) {
 const popup = document.getElementById('notConnectedPopup');
 if (event.target === popup) {
    closeNotConnectedPopup();
 }
});

document.addEventListener("DOMContentLoaded", function() {
  const profileBtn = document.getElementById("profileBtn");
  const profilePopup = document.getElementById("profilePopup");
  const notConnectedPopup = document.getElementById("notConnectedPopup");

  // Simule l'état de connexion (remplace par ta logique PHP plus tard)
  const isLoggedIn = true; // false si l'utilisateur n'est pas connecté

  profileBtn.addEventListener("click", function(event) {
      event.preventDefault(); // empêche le lien de recharger la page

      if (isLoggedIn) {
          profilePopup.style.display = "flex";
      } else {
          notConnectedPopup.style.display = "flex";
      }
  });
});

function closeProfilePopup() {
  document.getElementById("profilePopup").style.display = "none";
}

function closeNotConnectedPopup() {
  document.getElementById("notConnectedPopup").style.display = "none";
}
