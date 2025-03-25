import express from 'express'
import {createQualif} from '../controller/qualificationController.js'

const qaulifRouter = express.Router();

qaulifRouter.route('/')
.post(createQualif);


export {qaulifRouter};