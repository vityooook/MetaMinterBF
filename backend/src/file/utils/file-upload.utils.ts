import { extname } from 'path';

export const editFileName = (req, file, callback) => {
  console.log(file)
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}${fileExtName}`);
};

export const imageFileFilter = (req, file, callback) => {
  if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|svg)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};
