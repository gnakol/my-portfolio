export interface Training {

  idTraining: number;

  refTraining?: string;

  label: string;

  diploma?: string;

  yearOfObtaining: string;

  establishment_id: number; // 🔥 L'API envoie ça
  
  establishment?: { id: number; name: string; city: string }; // 🔥 On le récupère après
}

  export interface TrainingResponse {

    content: Training[]; // 🔥 Liste des formations

    pageable: any; // Infos de pagination

    totalElements: number;

    totalPages: number;

    last: boolean;
    
    size: number;
}