import {addUserEmail,userEmailRemoval,createUserQualifications,
    qualificationsUpdate,qualificationsDeletion,updateAbout} from '../controller/userController.js'
import express from 'express';
const userRouter = express();

userRouter.patch('/email/:id/add',addUserEmail);
userRouter.patch('/email/:id/remove',userEmailRemoval);

userRouter.post('/qaulifications',createUserQualifications);
userRouter.route('/qaulifications/:id')
.put(qualificationsUpdate)
.delete(qualificationsDeletion)

userRouter.patch('/about',updateAbout)


export {userRouter};