import { Module } from '@nestjs/common';
import { CriteriaController } from './criteria.controller';
import { CriteriaService } from './criteria.service';

@Module({
    imports: [],
    controllers: [CriteriaController],
    providers: [CriteriaService]
})

export class CriteriaModule {}