export interface ExperienceType {

    idExperienceType: number;

    refExperienceType: string;

    name: string;
}

// ✅ Nouveau modèle pour structurer la réponse backend paginée
export interface ExperienceTypeResponse {

    content: ExperienceType[]; // 🔥 Liste des types d'expériences

    pageable: any; // Infos de pagination

    totalElements: number;

    totalPages: number;

    last: boolean;
    
    size: number;
}
