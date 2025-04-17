import {config} from 'dotenv'
config();
import express from 'express';

import {postRouter} from './routers/postRoute.js'
import { jobRouter } from './routers/jobRouter.js';
import { userRouter } from './routers/userRouter.js';
import { globalErrorHandler } from './controller/errorController.js';
import { qaulifRouter } from './routers/qaulfRouter.js'
import { AppError } from './utils/appError.js';
import {recruiterRouter} from './routers/recruiterRouter.js'
import {uploadImgRouter,uploadPdfRouter} from './routers/uploadRouter.js'
import limit from 'express-rate-limit'
import helmet from 'helmet'
import cors from 'cors'

const app = express();

app.use(cors({
    origin: "*"
}))

app.options('*',cors())

process.on('uncaughtException',(err)=>{
    console.log('Uncaught Exception! Shutting down...')
    console.log(err.name,err.message)
        process.exit(1)
   })

const limiter = limit({
    max: 100,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'Too many requests from this IP, please try again in an hour!'
});



app.use(express.json({limit:'100kb'}));
app.use(helmet());
app.use('/api',limiter);
app.set('trust proxy',['52.41.36.82','54.191.253.12','44.226.122.3'])


app.use('/api/v1/posts',postRouter);
app.use('/api/v1/jobs',jobRouter);
app.use('/api/v1/users',userRouter)
app.use('/api/v1/users/qualifications',qaulifRouter);
app.use('/api/v1/recruiters',recruiterRouter);
app.use('/api/v1/uploads/img',uploadImgRouter);
app.use('/api/v1/uploads/pdf',uploadPdfRouter);

app.all('/*', async (req,resp,next)=>{
    return next(new AppError(
        `The given URL ${req.originalUrl} not found!`,404))
})

app.use(globalErrorHandler)

export {app}

