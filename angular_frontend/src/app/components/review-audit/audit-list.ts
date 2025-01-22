export interface Audit {
  auditID: number;
  submitDate: string;
  finalVerdict: string;
  user: {
    dealershipName: string;
  };
}

export interface Images {
  id: number;
  auditID: number;
  fileName: string;
  modifiedFileName: string;
  verdict: string;
  override: string;
  criterion: {
    criteriaID: string;
    name: string;
    filename: string;
    guidelines: string;
  };
}
