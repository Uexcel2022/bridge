import {config} from 'dotenv'
config();
import express from 'express';
import {authRouter} from './routers/authRouter.js'
import {postRouter} from './routers/postRoute.js'
import { jobRouter } from './routers/jobRouter.js';
import { jobAppRouter } from './routers/jobAppRouter.js';
import { userRouter } from './routers/userRouter.js';
import { globalErrorHandler } from './controller/errorController.js';
import { qaulifRouter } from './routers/qaulfRouter.js'
import { AppError } from './utils/appError.js';

const app = express();
app.use(express.json());

app.use('/api/v1/auth',authRouter);
app.use('/api/v1/posts',postRouter);
app.use('/api/v1/jobs',jobRouter);
app.use('/api/v1/jobs/application',jobAppRouter)
app.use('/api/v1/users',userRouter)
app.use('/api/v1/users/qualifications',qaulifRouter);

app.all('/*',(req,resp,next)=>{
    return next(new AppError(
        `The given URL ${req.originalUrl} not found!`,404))
})

app.use(globalErrorHandler)

export {app}

