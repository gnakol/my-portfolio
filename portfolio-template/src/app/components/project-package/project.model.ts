export interface Project {

    idProject: number;

    refProject?: string;

    title: string;

    description?: string;

    startDate: string;

    endDate?: string;

    skillsDevelopment?: string;

    projectTypeId : number;

    projectType: { id: number; name: string }; 



  }

  export interface ProjectResponse {

    content: Project[];

    pageable: any;

    totalElements: number;

    totalPages: number;

    last: boolean;
    
    size: number;
}