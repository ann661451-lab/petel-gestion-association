
const SUPABASE_URL = "https://evbpmafgciphyfzmkctc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_b0oe1ZbLmoW52Ym69nIhfQ_IwfvOiip";

let supabaseClient;
let modeInscription = false;

const $ = (id) => document.getElementById(id);

function afficherMessage(message) {
  const element = $("message");
  if (element) element.textContent = message;
}

async function initSupabase() {
  if (supabaseClient) return supabaseClient;

  const { createClient } = await import(
    "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm"
  );

  supabaseClient = createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );

  window.supabaseClient = supabaseClient;
  return supabaseClient;
}

function methodeActuelle() {
  return $("method")?.value || "email";
}

function identifiantActuel() {
  return $("identifier")?.value.trim() || "";
}

function actualiserFormulaire() {
  const telephone = methodeActuelle() === "phone";
  const champ = $("identifier");

  if (champ) {
    champ.type = telephone ? "tel" : "email";
    champ.placeholder = telephone
      ? "+221771234567"
      : "Votre adresse e-mail";
    champ.autocomplete = telephone ? "tel" : "username";
  }

  const label = $("identifierLabel");
  if (label) {
    label.textContent = telephone
      ? "Numéro de téléphone (avec indicatif)"
      : "Adresse e-mail";
  }

  const bouton = $("loginButton");
  if (bouton) {
    bouton.textContent = modeInscription
      ? "Créer mon compte"
      : "Se connecter";
  }

  const titre = $("formTitle");
  if (titre) {
    titre.textContent = modeInscription
      ? "Créer un compte"
      : "Connexion";
  }

  const groupe = $("confirmPasswordGroup");
  const confirmation = $("confirmPassword");

  if (groupe) groupe.hidden = !modeInscription;
  if (confirmation) confirmation.required = modeInscription;

  const bascule = $("toggleSignup");
  if (bascule) {
    bascule.textContent = modeInscription
      ? "J'ai déjà un compte"
      : "Créer un compte";
  }

  const motDePasse = $("password");
  if (motDePasse) {
    motDePasse.autocomplete = modeInscription
      ? "new-password"
      : "current-password";
  }
}

async function traiterFormulaire(event) {
  event.preventDefault();

  const identifiant = identifiantActuel();
  const motDePasse = $("password")?.value || "";
  const confirmation = $("confirmPassword")?.value || "";
  const telephone = methodeActuelle() === "phone";

  if (!identifiant || !motDePasse) {
    afficherMessage("Remplis tous les champs obligatoires.");
    return;
  }

  if (telephone && !/^\+[1-9]\d{7,14}$/.test(identifiant)) {
    afficherMessage(
      "Entre un numéro international, par exemple +221771234567."
    );
    return;
  }

  if (motDePasse.length < 6) {
    afficherMessage("Le mot de passe doit contenir au moins 6 caractères.");
    return;
  }

  if (modeInscription && motDePasse !== confirmation) {
    afficherMessage("Les deux mots de passe ne correspondent pas.");
    return;
  }

  const bouton = $("loginButton");
  if (bouton) bouton.disabled = true;

  try {
    afficherMessage(
      modeInscription ? "Création du compte..." : "Connexion en cours..."
    );

    const client = await initSupabase();
    let resultat;

    if (modeInscription) {
      const options = {
        data: {
          full_name: "",
          role: "lecteur"
        }
      };

      resultat = await client.auth.signUp(
        telephone
          ? { phone: identifiant, password: motDePasse, options }
          : { email: identifiant, password: motDePasse, options }
      );

      if (resultat.error) throw resultat.error;

      if (resultat.data.session) {
        afficherMessage("Compte créé et connexion réussie !");
        window.location.href = "./dashboard.html";
      } else if (resultat.data.user) {
        afficherMessage(
          "Compte créé. Si Supabase exige encore une confirmation, vérifie ses réglages d'authentification."
        );
      } else {
        afficherMessage("La création du compte n'a pas été confirmée.");
      }
    } else {
      resultat = await client.auth.signInWithPassword(
        telephone
          ? { phone: identifiant, password: motDePasse }
          : { email: identifiant, password: motDePasse }
      );

      if (resultat.error) throw resultat.error;

      if (resultat.data.session) {
        afficherMessage("Connexion réussie !");
        window.location.href = "./dashboard.html";
      } else {
        afficherMessage("Aucune session créée. Réessaie.");
      }
    }
  } catch (error) {
    console.error("Erreur d'authentification :", error);
    afficherMessage("Erreur : " + (error.message || "opération impossible"));
  } finally {
    if (bouton) bouton.disabled = false;
  }
}

async function connexionGoogle() {
  try {
    afficherMessage("Ouverture de la connexion Google...");

    const client = await initSupabase();

    const { error } = await client.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/dashboard.html"
      }
    });

    if (error) throw error;
  } catch (error) {
    console.error("Erreur Google :", error);
    afficherMessage("Connexion Google impossible : " + error.message);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  actualiserFormulaire();

  $("method")?.addEventListener("change", actualiserFormulaire);

  $("toggleSignup")?.addEventListener("click", () => {
    modeInscription = !modeInscription;
    actualiserFormulaire();
    afficherMessage("");
  });

  $("authForm")?.addEventListener("submit", traiterFormulaire);
  $("googleButton")?.addEventListener("click", connexionGoogle);

  try {
    const client = await initSupabase();
    const { data, error } = await client.auth.getSession();

    if (error) throw error;

    if (data.session) {
      console.log("Session active.");
    }
  } catch (error) {
    console.error("Initialisation :", error);
    afficherMessage(
      "Impossible de se connecter à Supabase. Vérifie Internet et la configuration."
    );
  }
});
        
