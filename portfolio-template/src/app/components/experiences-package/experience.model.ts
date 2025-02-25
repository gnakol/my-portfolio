export interface Experience {

    idExperience: number;

    refExperience?: string;

    title: string;

    description?: string;

    startDate: string;

    endDate?: string;

    companyName?: string;

    experienceType_id : number;
    
    experienceType: { id: number; name: string }; // Object au lieu d’un ID
  }
  