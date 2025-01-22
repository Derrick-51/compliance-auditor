import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { spawn } from 'child_process';
import { error } from 'console';
import * as fs from 'fs';
import * as path from 'path';
import { Criterion } from 'src/criteria/entities/criterion.entity';
import { DataSource, Repository } from 'typeorm';
import { Audit } from '../audit/entities/audit.entity';
import { Evidence } from './entities/evidence.entity';

@Injectable()
export class EvidenceService {
  constructor(
    @InjectRepository(Evidence)
    private evidenceRepository: Repository<Evidence>,
    private dataSource: DataSource,
  ) {}

  async create(
    fileName: string,
    criterion: Criterion,
    audit: Audit,
  ): Promise<Evidence> {
    const newImage = await this.evidenceRepository.save({
      fileName,
      criterion,
      audit,
    });

    if (!newImage) {
      throw new Error('Unable to create evidence in database');
    }

    this.analyzeImage(newImage, criterion);

    return newImage;
  }

  findAll() {
    return `This action returns all image`;
  }

  //Function to select the evidence from a selected audit
  async findAudit(auditID: number): Promise<Evidence[]> {
    return this.evidenceRepository.find({
      where: { audit: { auditID: auditID } },
      select: ['id', 'verdict', 'override', 'fileName'],
      relations: ['criterion'],
    });
  }

  //This function will only override the verdict, so I will make it a separate function
  async overrideVerdict(evidenceID: number, verdict: string) {
    //Compare if the verdict is the same first, if so, then we will not update the verdict (this is to make sure the radio button doesn't override itself with a "new" verdict, in the case that the radio button remains the same)
    const evidence = await this.evidenceRepository.findOne({
      where: { id: evidenceID },
      select: ['verdict'],
    });

    //Error handling
    if (!evidence) {
      throw new error('Evidence not found');
    }

    if (verdict === evidence.verdict) {
      //Do not update if the old verdict is the same as the input
      console.log('Verdict is the same');
    } else {
      //Now we will update since the verdict is different
      return await this.evidenceRepository.update(
        { id: evidenceID }, //condition
        { verdict: verdict, override: true, update: new Date() }, //updated data, since the override is a check, and update is just the current time, I can simply hardcode these in
      );
    }
  }

  async findOne(fileName: string) {
    return await this.evidenceRepository.findOne({
      where: { fileName: fileName },
      relations: { criterion: true, audit: true },
    });
  }

  async update(
    evidence: Evidence,
    criterion: Criterion,
    fileName: string,
  ): Promise<Evidence> {
    const oldFileName = evidence.fileName;
    evidence.fileName = fileName;
    evidence.verdict = 'Pending';
    await evidence.save();

    // Remove old image
    fs.unlink(path.resolve(__dirname, `../../images/${oldFileName}`), (err) => {
      if (err) {
        console.log('Could not delete previous image: ' + err);
      }
    });

    this.analyzeImage(evidence, criterion);

    return evidence;
  }

  remove(id: number) {
    return `This action removes a #${id} image`;
  }

  async analyzeImage(
    evidence: Evidence,
    criterion: Criterion,
  ): Promise<string> {
    let result: string;
    const evidenceFileName = evidence.fileName;
    const criterionFileName = criterion.filename;
    try {
      if (!evidenceFileName) {
        throw new Error('No evidence file name provided in analyzeImage()');
      }
      if (!criterionFileName) {
        throw new Error('No criterion file name provided in analyzeImage()');
      }

      // Call audit script with evidence and criterion image names
      const auditScript = spawn('py', [
        '-3.11',
        '../evidence_analysis/audit_image.py',
        evidenceFileName,
        criterionFileName,
      ]);

      // Script error event listener
      auditScript.stderr.on('data', (err) => {
        console.log('Audit Script Error: ' + err);
      });

      // Script exit event listener
      auditScript.on('close', (code) => {
        console.log(`Audit Script exited with code: ${code}`);

        if (code === 1) {
          this.updateVerdict(evidenceFileName, 'Error');
          throw new Error('audit_image.py exited with error');
        }

        // Read and delete audit result file
        result = this.consumeEvidenceResult(evidenceFileName);

        this.updateVerdict(evidenceFileName, result);
      });
    } catch (err) {
      console.log(err.message);
      throw err;
    }

    return result;
  }

  // Read and delete result file for given image
  consumeEvidenceResult(fileName: string): string {
    const fileBaseName = path.posix.basename(fileName, path.extname(fileName));
    const resultPath = path.resolve(
      __dirname,
      `../../analysis_results/${fileBaseName}.txt`,
    );
    const result = fs.readFileSync(resultPath, 'utf-8');

    if (!result) {
      throw new Error('Error reading audit results file');
    }

    fs.unlink(resultPath, (err) => {
      if (err) throw err;
    });

    return result;
  }

  async updateVerdict(fileName: string, verdict: string) {
    let evidence = await this.findOne(fileName);

    evidence.verdict = verdict;
    await evidence.save();
  }
}
