import { createUser } from "../services/userService.js";

export  const signup = async (req,resp,next)=>{
    const {name,phoneNumber,email} = {...req.body}
    // req.body.createdAt
    const newUser = await createUser(req.body);
    resp.status(201).json({
        satatus: 'success',
        data: {
            user : newUser
        }
    })
} 