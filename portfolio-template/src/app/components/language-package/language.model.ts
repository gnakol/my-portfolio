export interface Language{

    idLanguage : number;

    refLanguage : string;

    name : string;

    proficiencyLevel : string
}

  export interface LanguageResponse {

    content: Language[]; 

    pageable: any; // Infos de pagination

    totalElements: number;

    totalPages: number;

    last: boolean;
    
    size: number;
}