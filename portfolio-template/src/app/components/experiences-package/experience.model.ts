export interface Experience {

    idExperience: number;

    refExperience?: string;

    title: string;

    description?: string;

    startDate: string;

    endDate?: string;

    companyName?: string;

    experienceType_id : number;
    
    experienceType: { id: number; name: string }; 

    skillsAcquired : string;

  }

  export interface ExperienceResponse {

    content: Experience[];

    pageable: any;

    totalElements: number;

    totalPages: number;

    last: boolean;
    
    size: number;
}
  