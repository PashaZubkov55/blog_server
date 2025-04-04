const uuid = require('uuid')
const path = require('path') 
const {Post} = require('../models/models')
const ApiError = require('../errors/apiError')




class PostController{
async getAll(req, res, next){
    try{
    const posts = await Post.findAll()
    return res.json(posts)
    }catch(err){
        next(ApiError.badRequest(err.message))
    }
}

async create (req, res, next){
    try{
        const {title, description, userId} = req.body
        const {img} = req.files
        let fileName = uuid.v4() +'.jpg'
        img.mv(path.resolve(__dirname, '..', 'static', fileName))
    
        const posts = await Post.create({title, description, userId, img: fileName})

        return res.json(posts)
    } catch(err){
        next(ApiError.badRequest(err.message))
    }
   
}
async getOne(req, res){
   const {id} = req.params
   const post = await Post.findOne({where:{id}})
   return res.json(post)
}
async del(req, res){
   const {id} = req.params
   const post = await Post.destroy({where:{id}})
   return res.json(post)

}

}
module.exports = new PostController()