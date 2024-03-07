export interface Audit {
  id: number;
  auditDate: Date;
  dueDate: Date;
  finalVerdict: string;
  user: {
    dealershipName: string;
  };
  //imageUrl?: Images[]; Save for later
}

export interface Images {
  id: number;
  auditID: number;
  imageUrl: string;
  verdict: string;
  override: string;
}
