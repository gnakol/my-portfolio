export interface Hobbies{

    idHobbies : number;

    refHobby : string;

    name : string;

    description : string;
}

  export interface HobbiesResponse {
  
      content: Hobbies[]; 
  
      pageable: any;
  
      totalElements: number;
  
      totalPages: number;
  
      last: boolean;
      
      size: number;
  }