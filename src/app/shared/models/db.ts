export class user {
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
}

export class Auth {
    info : user|null;
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
