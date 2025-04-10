import multer from 'multer';
import path from 'path';
import { AppError } from './appError.js';

const storage = multer.diskStorage({   
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
})

const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    }
    cb(new AppError('Error: File upload only supports the following filetypes - ' + fileTypes, 400));
};

export const sizeLimit = multer({
    storage : storage,
    fileFilter : fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5 MB
    }
})