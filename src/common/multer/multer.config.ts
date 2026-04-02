import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import * as multer from 'multer';
import * as path from 'path';

export const multerConfig: MulterOptions = {
  storage: multer.diskStorage({
    // destination: path.join(process.cwd(), 'uploads'),
    destination: function (req, file, cb) {
      const storagePath = path.join(process.cwd(), 'uploads');
      cb(null, storagePath);
    },
    filename: function (req, file, cb) {
      const prefix = crypto.randomUUID();
      const extension = file.originalname.split('.').at(-1);
      cb(null, `${prefix}.${extension}`);
    },
  }),
};
