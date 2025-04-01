class PostController{
async getAll(req, res){
    

}

async create (req, res){
    const {title, description, userId} = req.body
    const {img} = req.files
    
}
async getPost(){

}
async del(){

}

}
module.exports = new PostController()