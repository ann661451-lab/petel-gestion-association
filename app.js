// ==========================================
// PETEL ASSOCIATION - APPLICATION
// Solidarité & Développement
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

  console.log("Petel Association - Application démarrée");

  // ------------------------------------------
  // CONFIGURATION
  // ------------------------------------------

  const APP_NAME = "Petel Association";
  const ASSOCIATION_NAME = "Solidarité & Développement";

  // ------------------------------------------
  // BOUTON DE CONNEXION
  // ------------------------------------------

  const loginForm = document.querySelector("form");

  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const emailInput =
        document.querySelector('input[type="email"]');

      const passwordInput =
        document.querySelector('input[type="password"]');

      const email = emailInput ? emailInput.value.trim() : "";
      const password = passwordInput ? passwordInput.value : "";

      if (!email || !password) {
        alert("Veuillez remplir votre adresse e-mail et votre mot de passe.");
        return;
      }

      // Pour le moment : démonstration de connexion.
      // La vraie connexion Supabase sera ajoutée ensuite.

      localStorage.setItem("petel_user_email", email);
      localStorage.setItem("petel_user_connected", "true");

      alert("Connexion réussie !");

      afficherAccueil();
    });
  }

  // ------------------------------------------
  // AFFICHAGE DE L'ACCUEIL
  // ------------------------------------------

  function afficherAccueil() {

    document.body.innerHTML = `
      <div class="app">

        <header class="app-header">
          <h1>${APP_NAME}</h1>
          <p>${ASSOCIATION_NAME}</p>
        </header>

        <main class="dashboard">

          <h2>Tableau de bord</h2>

          <div class="cards">

            <div class="card">
              <h3>👥 Membres</h3>
              <p id="members-count">0</p>
            </div>

            <div class="card">
              <h3>💰 Cotisations</h3>
              <p id="contributions-total">0 FCFA</p>
            </div>

            <div class="card">
              <h3>💸 Dépenses</h3>
              <p id="expenses-total">0 FCFA</p>
            </div>

            <div class="card">
              <h3>🏦 Caisse</h3>
              <p id="cash-balance">0 FCFA</p>
            </div>

          </div>

          <div class="menu">

            <button onclick="ouvrirMembres()">
              👥 Membres
            </button>

            <button onclick="ouvrirFinances()">
              💰 Finances
            </button>

            <button onclick="ouvrirMessages()">
              💬
