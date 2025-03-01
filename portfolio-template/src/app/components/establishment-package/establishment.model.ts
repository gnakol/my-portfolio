export interface Establishment{

    idEstablishment : number;

    refEstablishment : string;

    name : string;

    city : string;
}

export interface EstablishmentResponse {

    content: Establishment[]; // 🔥 Liste des types des etablissement

    pageable: any; // Infos de pagination

    totalElements: number;

    totalPages: number;

    last: boolean;
    
    size: number;
}
