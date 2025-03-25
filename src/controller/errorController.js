import { AppError } from "../utils/appError.js";

const globalErrorHandler = async(err,req,res,next)=>{
    err.statusCode = err.statusCode || 500
    err.status = err.status||'error'
    console.log(err.name);

    if(err.name ==='JsonWebTokenError'){
        err = new AppError('Invalid token. Please login again',401)
    }

    if(err.name ==='TokenExpiredError'){
        err = new AppError('The Token is expired. Please login again',401)
    }

    if(process.env.NODE_ENV==='development'){
        if(err.isOperational){
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
                error: err,
                error: err.stack
            })
        }else{
            res.status(500).json({
                status: err.status,
                message: err.message,
                error: err,
                error: err.stack
            })
        }
    }

    if(process.env.NODE_ENV==='production'){
        if(err.isOperational){
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            })
        }else{
            console.log(err)
            res.status(500).json({
                status: 'error',
                message: 'Some went wrong!'
            })
        }
    }

}

export {globalErrorHandler}