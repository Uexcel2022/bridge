import express from 'express'
import {createQualif,qualifUpdate,deleteQaulif} from '../controller/qualificationController.js'
import{ protect } from '../controller/authController.js'

const qaulifRouter = express.Router();

qaulifRouter.use(protect)

qaulifRouter.route('/').post(protect,createQualif);
qaulifRouter.route('/:id').patch(protect,qualifUpdate)
.delete(protect,deleteQaulif)


export {qaulifRouter};