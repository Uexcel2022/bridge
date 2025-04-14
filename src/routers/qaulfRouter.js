import express from 'express'
import {createQualif,qualifUpdate,deleteQaulif} from '../controller/qualificationController.js'
import{ protect,restrictTo } from '../auth/auth.js'

const qaulifRouter = express.Router();

qaulifRouter.use(protect)

qaulifRouter.route('/').post(protect,restrictTo('user'),createQualif);
qaulifRouter.route('/:id').patch(protect,restrictTo('user'),qualifUpdate)
.delete(protect,restrictTo('user'),deleteQaulif)

export {qaulifRouter};