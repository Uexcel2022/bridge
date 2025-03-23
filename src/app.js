import express from 'express';
import {authRouter} from './routers/authRouter.js'
import {postRouter} from './routers/postRoute.js'
import { jobRouter } from './routers/jobRouter.js';
import { jobAppRouter } from './routers/jobAppRouter.js';
import { userRouter } from './routers/userRouter.js';

const app = express();

app.use(express.json());

app.use('/api/v1/signup',authRouter);
app.use('/api/v1/posts',postRouter);
app.use('/api/v1/jobs',jobRouter);
app.use('/api/v1/jobs/application',jobAppRouter)
app.use('/api/v1/users',userRouter)

export {app}
