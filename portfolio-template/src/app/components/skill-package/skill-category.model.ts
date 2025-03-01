export interface SkillCategory{
    
    idSkillCategory : number;

    refSkillCategory : string;

    name : string;
}

export interface SkillCategoryResponse {

    content: SkillCategory[]; // 🔥 Liste des types d'expériences

    pageable: any; // Infos de pagination

    totalElements: number;

    totalPages: number;

    last: boolean;
    
    size: number;
}