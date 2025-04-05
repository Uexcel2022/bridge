import express from 'express'
import {createQualif,qualifUpdate,deleteQaulif} from '../controller/qualificationController.js'
import{ protectUser } from '../controller/userAuthController.js'

const qaulifRouter = express.Router();

qaulifRouter.use(protectUser)

qaulifRouter.route('/').post(protectUser,createQualif);
qaulifRouter.route('/:id').patch(protectUser,qualifUpdate)
.delete(protectUser,deleteQaulif)


export {qaulifRouter};