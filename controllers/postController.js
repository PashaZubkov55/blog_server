const uuid = require('uuid')
const path = require('path') 
const {Post} = require('../models/models')
const ApiError = require('../errors/apiError')



class PostController{
async getAll(req, res){
    

}

async create (req, res, next){
    try{
        const {title, description, userId} = req.body
        const {img} = req.files
        let fileName = uuid.v4() +'.jpg'
        img.mv(path.resolve(__dirname, '..', 'static', fileName))
    
        const post = await Post.create({title, description, userId, img: fileName})

        return res.json(post)
    } catch(err){
        next(ApiError.badRequest(err.message))
    }
   
}
async getPost(){

}
async del(){

}

}
module.exports = new PostController()