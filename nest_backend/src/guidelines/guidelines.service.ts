import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class GuidelinesService {
  saveGuidelines(guidelines: any): void {
    console.log('Received guidelines:', guidelines); // Log the received guidelines

    // Extract the guidelines content from the received object
    const guidelinesContent = guidelines.guidelines;

    // Convert guidelines content to a string
    const guidelinesString = typeof guidelinesContent === 'string' ? guidelinesContent : JSON.stringify(guidelinesContent);

    const folderPath = path.join(__dirname, '..', '..', 'guidelines'); // Path to the guidelines folder
    const filePath = path.join(folderPath, 'audit-submission-guidelines.md'); // Path to the guidelines file
    
    // Check if the guidelines folder exists, if not, create it
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    try {
      // Write the guidelines content to the file
      fs.writeFileSync(filePath, guidelinesString);
      console.log('Guidelines saved successfully to file:', filePath);
    } catch (error) {
      console.error('Error saving guidelines:', error);
    }
  }
}