import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class CriteriaService {
    constructor() {}

    async createCriteria(fileName: string, criteriaName: string, description: string) {
        console.log(fileName)
        console.log(criteriaName)
        console.log(description)
    }
}