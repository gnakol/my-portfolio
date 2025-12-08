export interface StackTag {
  id?: number;
  label: string;
  tagType?: string;
  createdAt?: Date;
}

export interface CreateStackTagRequest {
  label: string;
  tagType?: string;
}
