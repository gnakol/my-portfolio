// log-security.model.ts
export interface LogSecurityDTO {

    idLog: number;

    typeLog: string;

    message: string;

    dateLog: string;

    ipSource: string;
  }
  
  export interface LogSecurityResponse {

    content: LogSecurityDTO[];

    totalElements: number;

    totalPages: number;

    size: number;
    
    number: number;
  }