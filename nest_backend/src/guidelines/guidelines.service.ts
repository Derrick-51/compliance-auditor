import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class GuidelinesService {
  saveGuidelines(guidelines: string): void {
    const folderPath = path.join(__dirname, '..', 'guidelines'); // Path to the guidelines folder
    const filePath = path.join(folderPath, 'audit-submission-guidelines.md'); // Path to the guidelines file
    
    // Check if the guidelines folder exists, if not, create it
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    // Write the guidelines content to the file
    fs.writeFileSync(filePath, guidelines);

    console.log('Guidelines saved successfully.');
  }
}