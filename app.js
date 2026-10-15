// =====================================================
// PETEL ASSOCIATION - APPLICATION
// Solidarité & Développement
// =====================================================

const SUPABASE_URL = "https://evbpmafgciphyfzmkctc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_b0oe1ZbLmoW52Ym69nIhfQ_IwfvOiip";

let supabaseClient = null;
let initialisationEnCours = null;

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
// INITIALISATION SUPABASE
// -----------------------------------------------------

async function initSupabase() {
  if (supabaseClient) return supabaseClient;

  if (initialisationEnCours) return initialisationEnCours;

  initialisationEnCours = (async () => {
    const { createClient } = await import(
      "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm"
    );

    supabaseClient = createClient(
      SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY
    );

    window.supabaseClient = supabaseClient;
    console.log("Client Supabase initialisé.");

    return supabaseClient;
  })();

  try {
    return await initialisationEnCours;
  } catch (error) {
    initialisationEnCours = null;
    console.error("Erreur Supabase :", error);
    afficherMessage("Impossible de charger Supabase. Vérifie ta connexion Internet.");
    throw error;
  }
}

// -----------------------------------------------------
// VÉRIFICATION DE SESSION
// -----------------------------------------------------

async function verifierSession() {
  if (!supabaseClient) return;

  const { data, error } = await supabaseClient.auth.getSession();

  if (error) {
    console.error("Erreur de session :", error);
    return;
  }

  if (data.session) {
    console.log("Utilisateur connecté.");
  }
}

// -----------------------------------------------------
// CONNEXION
// -----------------------------------------------------

window.login = async function () {
  try {
    afficherMessage("Vérification des informations...");

    const emailElement = document.getElementById("email");
    const passwordElement = document.getElementById("password");

    if (!emailElement || !passwordElement) {
      afficherMessage("Erreur : champs de connexion introuvables.");
      return;
    }

    const email = emailElement.value.trim();
    const password = passwordElement.value;

    if (!email || !password) {
      afficherMessage("Entre ton adresse e-mail et ton mot de passe.");
      return;
    }

    afficherMessage("Connexion en cours...");

    await initSupabase();

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) {
      console.error("Erreur de connexion :", error);
      afficherMessage("Erreur de connexion : " + error.message);
      return;
    }

    if (data.session) {
      afficherMessage("Connexion réussie !");
      window.location.href = "./dashboard.html";
      return;
    }

    afficherMessage("Connexion non confirmée. Réessaie.");
  } catch (error) {
    console.error("Erreur pendant la connexion :", error);
    afficherMessage("Échec de la connexion. Vérifie Internet et réessaie.");
  }
};

// -----------------------------------------------------
// MOT DE PASSE OUBLIÉ
// -----------------------------------------------------

window.forgotPassword = async function () {
  try {
    const emailElement = document.getElementById("email");

    if (!emailElement || !emailElement.value.trim()) {
      afficherMessage("Entre ton adresse e-mail.");
      return;
    }

    await initSupabase();

    const { error } = await supabaseClient.auth.resetPasswordForEmail(
      emailElement.value.trim()
    );

    if (error) {
      afficherMessage("Erreur : " + error.message);
      return;
    }

    afficherMessage("E-mail de réinitialisation envoyé.");
  } catch (error) {
    console.error("Erreur de réinitialisation :", error);
    afficherMessage("Impossible d'envoyer l'e-mail pour le moment.");
  }
};

// -----------------------------------------------------
// ÉVÉNEMENTS DE LA PAGE
// -----------------------------------------------------

document.addEventListener("DOMContentLoaded", function () {
  const bouton = document.getElementById("loginButton");

  if (!bouton) {
    console.error("Bouton loginButton introuvable.");
    return;
  }

  bouton.addEventListener("click", function () {
    window.login();
  });

  initSupabase()
    .then(() => verifierSession())
    .catch((error) => {
      console.error("Initialisation Supabase impossible :", error);
    });
});
