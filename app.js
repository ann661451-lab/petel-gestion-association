// =====================================================
// PETEL ASSOCIATION - APPLICATION
// Solidarité & Développement
// =====================================================

// -----------------------------------------------------
// SUPABASE
// -----------------------------------------------------

const SUPABASE_URL = "https://evbpmafgciphyfzmkctc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_b0oe1ZbLmoW52Ym69nIhfQ_IwfvOiip";

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

  const { data, error } =await supabaseClient.auth.signInWithPassword({
  email: email,
  password: password
});

if (error) {
  afficherMessage("Erreur : " + error.message);
  return;
}

afficherMessage("Connexion réussie !");

setTimeout(function () {
  window.location.href = "dashboard.html";
}, 1000);

};

// -------------------------------------------
// VERIFICATION DE SESSION
// -------------------------------------------

async function verifierSession() {
  const { data } = await supabaseClient.auth.getSession();

  if (data.session) {
    console.log("Utilisateur connecté.");
  }
}

// -------------------------------------------
// MOT DE PASSE OUBLIE
// -------------------------------------------

window.forgotPassword = async function () {
  const emailElement = document.getElementById("email");

  if (!emailElement || !emailElement.value.trim()) {
    afficherMessage("Entrez votre adresse e-mail.");
    return;
  }

  const email = emailElement.value.trim();

  const { error } =
    await supabaseClient.auth.resetPasswordForEmail(email);

  if (error) {
    afficherMessage("Erreur : " + error.message);
    return;
  }

  afficherMessage("E-mail de réinitialisation envoyé.");
};
