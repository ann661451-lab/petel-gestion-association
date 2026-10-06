// =====================================================
// PETEL ASSOCIATION - APPLICATION
// Solidarité & Développement
// =====================================================

// -----------------------------------------------------
// SUPABASE
// -----------------------------------------------------

const SUPABASE_URL = "COLLE_ICI_TON_PROJECT_URL";
const SUPABASE_PUBLISHABLE_KEY = "COLLE_ICI_TA_PUBLISHABLE_KEY";

let supabaseClient = null;

// Chargement de Supabase
async function initSupabase() {
  try {
    const { createClient } = await import(
      "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm"
    );

    supabaseClient = createClient(
      SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY
    );

    console.log("Supabase connecté.");

    await verifierSession();

  } catch (error) {
    console.error("Erreur Supabase :", error);
    afficherMessage("Erreur de connexion à Supabase.");
  }
}

// -----------------------------------------------------
// INITIALISATION
// -----------------------------------------------------

document.addEventListener("DOMContentLoaded", function () {
  console.log("Petel Association - Application");

  initSupabase();
});

// -----------------------------------------------------
// MESSAGE
// -----------------------------------------------------

function afficherMessage(message) {
  const element = document.getElementById("message");

  if (element) {
    element.textContent = message;
  }
}

// -----------------------------------------------------
// CONNEXION
// -----------------------------------------------------

window.login = async function () {

  if (!supabaseClient) {
    afficherMessage("Connexion à Supabase en cours...");
    return;
  }

  const emailElement = document.getElementById("email");
  const passwordElement = document.getElementById("password");

  if (!emailElement || !passwordElement) {
    afficherMessage("Champs de connexion introuvables.");
    return;
  }

  const email = emailElement.value.trim();
  const password = passwordElement.value;

  if (!email || !password) {
    afficherMessage("Veuillez remplir tous les champs.");
    return;
  }

  afficherMessage("Connexion en cours...");

  const { data, error } =
