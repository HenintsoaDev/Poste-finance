export class utilisateur {
    rowid: number;
    nom: string;
    prenom: string;
    telephone: string;
    login: string;
    fk_profil: number;
    fk_agence: number;
    admin: number;
    connect: number;
    state: number;
    superviseur: number;
    email: string;
    name: string;
    id_type_agence: any;
}

export class Auth {
    info : utilisateur|null;
    modules: module_user[] | []
}

export class module_user {
    id: number ;
    name: string ;
    code: string ;
    icon: string | null ;
    state: number | null ;
    hasOneSubModuleAction: boolean;
    sousModules: sous_module [] | null ;
}

export class sous_module {
    id: number ;
    name: string ;
    code: string ;
    icon: string | null ;
    module_id: string | null ;
    state: number | null ;
    actions: action [] | null | [];
}

export class module {
    id: number ;
    name: string ;
    code: string ;
    icon: string | null ;
    state: number | null ;
    actions: action [] | null | [];
}

export class action {
    id: number ;
    name: string ;
    code: string ;
    url: string ;
    state: number | null ;
    type_action_id: number ;
}
export class type_bureau {
    id: number ;
    name: string ;
    state: number | null ;
}

export class type_profil {
    id: number ;
    name: string ;
    code: string ;
    state: number | null ;
}

export class profil {
    id: number ;
    name: string ;
    code: string ;
    wallet_carte: number | null ;
    type_profil_id: string | null ;
    state: number | null ;
    actions: action [] | null | [];
}

export class bureau {
    rowid: number ;
    name: string ;
    code: string ;
    responsable: string | null ;
    fk_quartier: number | null ;
    province: number | null ;
    adresse: string | null ;
    tel: string | null ;
    email: string | null ;
    idtype_agence: number | null ;
    email_dr: string | null ;
    telephone_dr: string | null ;
    rapatrie_auto: boolean | null ;
    solde_max_rapatrie: number | null ;
    state: number | null ;
    actions: action [] | null | [];
   
}

export class province {
    id : number;
    lib_region : string ;
   
}


