import { userAddEmail,removeUserEmail,userUpdateAbout,userUpdateName} from "../services/userService.js";

export const createUserQualifications = async(req,resp,next)=>{
    try{
        req.body.createdAt = new Date(Date.now())
        req.body.userId = 1
        const newUserQaulf = await createUserQualif(req.body)
        resp.status(200).json({
            status: 'success',
            data:{
                qaulification: newUserQaulf
            }
        })
    }catch(err){
        resp.status(500).json({
        error: err.message
    })
  }
}

export const qualificationsUpdate = async(req,resp,next)=>{
    try{
        req.body.updatedAt = new Date(Date.now())
        req.body.userId = 1
        req.body.qfId = req.params.id*1
        const updatedUserQualif = await updateQualif(req.body)
        resp.status(200).json({
            status: 'success',
            data:{
                qaulification: updatedUserQualif
            }
        })
    }catch(err){
        resp.status(500).json({
        error: err.message
    })
  }
}

export const qualificationsDeletion = async(req,resp,next)=>{
    try{
        await deleteQualif((req.params.id*1))
        resp.status(204).json({
            status: 'success',
            data:{
                qaulification: null,
            }
        })
    }catch(err){
        resp.status(500).json({
        error: err.message
    })
  }
}



export const addUserEmail = async(req,resp,next)=>{
    try{
        const updatedUser = await userAddEmail(req.params.id*1, req.body.email);
        resp.status(200).json({
            status: 'success',
            data:{
                user: updatedUser
            }
        })
    }catch(err){
        resp.status(500).json({
            error: err.message
        })
    }
}

export const userEmailRemoval = async(req,resp,next)=>{
    try{
        const updatedUser = await removeUserEmail(req.params.id*1, req.body.email);
        resp.status(200).json({
            status: 'success',
            data:{
                user: updatedUser
            }
        })
    }catch(err){
        resp.status(err.code).json({
            error: err.message
        })
    }
}

export const updateAbout = async(req,resp,next)=>{
    try{
        req.body.updatedAt = new Date(Date.now())
        req.body.userId = 1
        const updatedUser = await userUpdateAbout(req.body)
        resp.status(200).json({
            status: 'success',
            data:{
                user:updatedUser
            }
        })
    }catch(err){
        resp.status(500).json({
        error: err.message
    })
  }
}


export const nameUpdate = async(req,resp,next)=>{
    const {surname,firstName,lastName} = req.body;
    
    if(!surname||!firstName||!lastName){
        throw new Error("All name fields are reqired!")
    }

    try{
        req.body.updatedAt = new Date(Date.now())
        req.body.userId = 1
        const updatedUser = await userUpdateName(req.body)
        resp.status(200).json({
            status: 'success',
            data:{
                user:updatedUser
            }
        })
    }catch(err){
        resp.status(500).json({
        error: err.message
    })
  }
}