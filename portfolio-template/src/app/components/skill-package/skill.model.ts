export interface Skill {

    idSkill: number;

    refSkill: string;

    name: string;

    description: string;

    levelSkill : number;

    skillCategory_id: number;
    
    skillCategory?: { id: number; name: string };
  }
  
  export interface SkillResponse {
  
      content: Skill[]; 
  
      pageable: any; // Infos de pagination
  
      totalElements: number;
  
      totalPages: number;
  
      last: boolean;
      
      size: number;
  }