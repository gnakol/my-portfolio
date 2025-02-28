export interface Skill {

    idSkill: number;

    refSkill: string;

    name: string;

    description: string;

    skillCategory_id: number; // 🔥 L'API envoie ça
    
    skillCategory?: { id: number; name: string }; // 🔥 On le récupère après si absent
  }
  