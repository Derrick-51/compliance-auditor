import { Injectable } from '@nestjs/common';

@Injectable()
export class GuidelinesService {
  private criteria: any[] = [];

  getCriteria(): any[] {
    return this.criteria;
  }

  updateCriterion(id: number, criterion: any): any {
    const index = this.criteria.findIndex(c => c.id === id);
    if (index !== -1) {
      this.criteria[index] = { ...this.criteria[index], ...criterion };
      return this.criteria[index];
    }
    return null;
  }

  updateAllCriteria(criteria: any[]): any {
    this.criteria = criteria;
    return this.criteria;
  }
}