const BASE_URL = "https://ws-distributeur.preprod-paositra.com" ;

export const environment = {
  production: true,
  userAuth : 'auth/me',
  menuItemsStorage : 'menuItemsPHCO',
  menuItemsSelectedStorage : 'menuItemsSelectedPHCO',
  authItemName:'__token_api_gate_way_phco',
  userItemName:'__user_api_gate_way_phco',

  module :'parametrage/module',
  sous_module :'parametrage/sousmodule',
  liste_module_active :'parametrage/consult/module/liste_module_active',
  type_bureau :'parametrage/type_bureau',
  type_profil :'parametrage/type_profil',
  getSoldeUser : 'parametrage/consult/bureaux/get_solde',
};
