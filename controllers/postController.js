const uuid = require('uuid')

class PostController{
async getAll(req, res){
    

}

async create (req, res){
    const {title, description, userId} = req.body
    const {img} = req.files
     const fileName = uuid.v4() + '.jpg'
}
async getPost(){

}
async del(){

}

}
module.exports = new PostController()