// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

const BASE_URL = "https://ws-distributeur.preprod-paositra.com" ;

export const environment = {
  production: false,
  baseUrl : BASE_URL,
  userAuth : 'auth/me',
  menuItemsStorage : 'menuItemsPHCO',
  menuItemsSelectedStorage : 'menuItemsSelectedPHCO',
  authItemName:'__token_api_gate_way_phco',
  userItemName:'__user_api_gate_way_phco',
  phcoTimeToken : '_phco_time_token',
  soldeWelletStorage : 'soldeWallet',
  soldeCarteStorage : 'soldeCarte',
  authorityModule : 'authority_module',
  authoritySousModule : 'authority_sousModule',
  soldeSuiviCompte : 'soldeSuiviCompte',
  soldeCarteSuiviCompte : 'soldeCarteSuiviCompte',
  exportPdf: BASE_URL + "/export_to/pdf",
  exportExcel: BASE_URL + "/export_to/excel",
  soldeVirementCp : 'soldeVirementCp',
  soldeVirementCarteCp : 'soldeVirementCarteCp',

  //** Parametrage */
  module :'parametrage/module',
  sous_module :'parametrage/sousmodule',
  liste_module_active :'parametrage/consult/module/liste_module_active',
  type_bureau :'parametrage/type_bureau',
  type_profil :'parametrage/type_profil',
  profil :'parametrage/profil',
  liste_profil_active :'parametrage/consult/profil/allActivatedProfil',
  liste_type_profil_active :'parametrage/consult/type_profil/liste_type_profil_active',
  utilisateur :'parametrage/user',
  liste_type_bureau_active :'parametrage/consult/type_bureau/type_de_bureaux_active',
  getSoldeUser : 'gestion_bureau/consult/bureaux/get_solde',
  regenerer_mdp :'parametrage/user/regenerer_password',
  profilage : 'parametrage/profilage',
  action : 'parametrage/action',
  appendroute : 'parametrage/settings/appendroute',
  generateroute : 'parametrage/settings/generateroute',
  
  //** Gestion bureau */
  liste_bureau_active :'gestion_bureau/consult/bureaux/liste_bureaux_active',
  bureau : 'gestion_bureau/bureaux',

  //** Ressource */
  province : 'resource/province/liste_province',
  departement : 'resource/departement/liste_departement',

  //** Gestion compte principal */
  suivi_compte : "gestion_compte_principal/suivi_compte",
  historique_virement : "gestion_compte_principal/virement",
};
