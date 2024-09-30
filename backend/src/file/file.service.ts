import { BadRequestException, Injectable } from '@nestjs/common';

import { existsSync, mkdirSync } from 'fs';

@Injectable()
export class FileService {
  constructor() {}

  private readonly collectionsDir = './assets/images/collections';
  private readonly itemsDir = './assets/images/items';

  // Called when the module is initialized (on app startup)
  async onModuleInit() {
    await this.ensureDirectoryExists(this.collectionsDir);
    await this.ensureDirectoryExists(this.itemsDir);
  }

  // Function to check if a directory exists and create it if not
  private async ensureDirectoryExists(dir: string) {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true }); // Create the directory and parent dirs if necessary
      console.log(`Created directory: ${dir}`);
    }
  }

  async handleFiles(files: Array<Express.Multer.File>) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded.');
    }

    // Logic to handle file renaming, moving, or processing
    const processedFiles = files.map((file) => {
      // You could move the file to a custom folder or modify its name here
      return {
        originalName: file.originalname,
        filename: file.filename,
        path: file.path,
        mimetype: file.mimetype,
      };
    });

    return processedFiles;
  }
}
