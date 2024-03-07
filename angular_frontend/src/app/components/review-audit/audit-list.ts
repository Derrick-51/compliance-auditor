export interface Audit {
  id: number;
  userID: number;
  auditDate: Date;
  dueDate: Date;
  finalVerdict: string;
  //imageUrl?: Images[];
}

export interface Images {
  id: number;
  auditID: number;
  imageUrl: string;
  verdict: string;
  override: string;
}
