export interface PingRequest{

    ipAddress : string;
}

export interface PingResponse{

    result : string;
}

export interface PingResponse {

    idSimulation?: number;

    refSimulation?: string;

    description: string;

    commandTest: string;

    expectedResult: string; // Assurez-vous que cette propriété existe bien !
    
    skillId?: number;
  }

  export interface VlanRequest {

    vlanId: string;
    
    vlanName: string;
}

export interface VlanResponse {

    idSimulation?: number;

    refSimulation?: string;

    description: string;

    commandTest: string;

    expectedResult: string;

    skillId?: number;
}

export interface FeedbackDTO {

    id?: number;

    experienceName: string;

    feedbackType: string;

    feedbackValue: string;
    
    createdAt?: string; // Optionnel car géré par le backend
}


export interface SimulationRequest {

    network: string;
    
    wildcard: string;

    processId : string;
}

export interface SimulationResponse {

    idSimulation?: number;

    refSimulation?: string;

    description: string;

    commandTest: string;

    expectedResult: string;
    
    skillId?: number;
}
