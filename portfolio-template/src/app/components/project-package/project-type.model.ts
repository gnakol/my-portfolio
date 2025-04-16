export interface ProjectType {

    idProjectType: number;

    refProject: string;

    name: string;
}

// ✅ Nouveau modèle pour structurer la réponse backend paginée
export interface ProjectTypeTypeResponse {

    content: ProjectType[]; // 🔥 Liste des types d'expériences

    pageable: any; // Infos de pagination

    totalElements: number;

    totalPages: number;

    last: boolean;
    
    size: number;
}