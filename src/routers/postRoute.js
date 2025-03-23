import { createPost} from '../controller/postController.js';
import express from 'express';
const postRouter = express.Router();

postRouter.route('/').post(createPost);


export {postRouter}