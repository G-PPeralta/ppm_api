import { existsSync, mkdirSync, writeFile } from 'fs';
import { promisify } from 'util';

export const checkIfFileOrDirectoryExists = (path: string): boolean => {
  return existsSync(path);
};

export const createFile = async (
  path: string,
  fileName: string,
  data: string,
): Promise<void> => {
  if (!checkIfFileOrDirectoryExists(path)) {
    mkdirSync(path);
  }

  const write = promisify(writeFile);

  return await write(`${path}/${fileName}`, data, 'utf8');
};
