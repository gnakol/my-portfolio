export interface Skill {

    idSkill: number;

    refSkill: string;

    name: string;

    description: string;

    skillCategory_id: number; // 🔥 L'API envoie ça
    
    skillCategory?: { id: number; name: string }; // 🔥 On le récupère après si absent
  }
  
  export interface SkillResponse {
  
      content: Skill[]; 
  
      pageable: any; // Infos de pagination
  
      totalElements: number;
  
      totalPages: number;
  
      last: boolean;
      
      size: number;
  }