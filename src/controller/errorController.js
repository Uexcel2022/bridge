import { AppError } from "../utils/appError.js";

const globalErrorHandler = async(err,req,res,next)=>{
    err.statusCode = err.statusCode || 500
    err.status = err.status||'error'
    console.log(err.name);

    if(err.name ==='PrismaClientValidationError'){
        err = new AppError("fail",400)
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

}

export {globalErrorHandler}