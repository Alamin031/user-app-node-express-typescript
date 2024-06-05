import fs from 'fs';

export function removeOldFile(filePath: string) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Old file at ${filePath} has been removed.`);
    }
  } catch (error) {
    console.error(`Error removing old file: ${error}`);
  }
}
