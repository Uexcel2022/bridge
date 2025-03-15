import { newPost } from "../services/postService.js";

export const createPost = async (req,resp,next)=>{
  const post = await newPost(req.body);
  resp.status(201).json({
    status: 'success',
    data: {
       post
    }
  })
}