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
async getOne(req, res, next){
    try{
        const {id} = req.params
        const post = await Post.findOne({where:{id}})
        return res.json(post)
    } catch(err){
        next(ApiError.badRequest(err.message))
    }
 
}
async del(req, res, next){
    try{
        const {id} = req.params
        const post = await Post.destroy({where:{id}})
        return res.json(post)

    } catch(err){
        next(ApiError.badRequest(err.message))
    }
   
}

    async update(req, res) {
        try {
            const { id } = req.params;
            const { title, description, userId } = req.body;
            const {img} = req.files
            console.log(img)
            let fileName =  uuid.v4() +'.jpg'
            img.mv(path.resolve(__dirname, '..', 'static', fileName))

          //let fileImg=  req.files.img|| {}
           // let files = req.files || {}; // Получаем файлы, либо пустой объект, если их нет
            //let imgFile = files.img && Array.isArray(files.img) ? files.img[0] : null; // Берём первый файл, если есть
           // console.log(fileImg)
            if (!img) throw new Error('Файл изображения не передан.');
    
            
            //console.log(fileImg)
            await img.mv(path.resolve(__dirname, '..', 'static',fileName )); // Сохраняем файл по правильному пути
    

            const updatedPost = await Post.update(
                { title, description, userId, img: fileName },
                { where: { id } }
            );
    
            return res.json(updatedPost);
        } catch (err) {
            console.log(err);
            return res.status(500).json({ error: err.message });
        }
    
}
}
   
module.exports = new PostController()