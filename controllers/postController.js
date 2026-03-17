const uuid = require('uuid')
const path = require('path') 
const fs = require('fs').promises;
const {Post} = require('../models/models')
const ApiError = require('../errors/apiError')
const { Op } = require('sequelize')






class PostController{
async getAll(req, res, next){
    const {title} = req.params
    try{
        if (title) {
            const posts = await Post.findAll({where:{title:{
                [Op.iLike]: `%${title}%`
            }}})
            return res.json(posts)
        }
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
    async searchPost(req,res,next){
        const {title} = req.params
        try {
            const post = await Post.findOne({where:{title}})
             return res.json(post)
        } catch (error) {
            next(ApiError.badRequest(err.message))
        }
    }
/*async del(req, res , next){
    try{
        const {id} = req.params
        const  post = await Post.findByPk(id)
        fs.unlinkSync(path.resolve(__dirname, '..', 'static', post.img))
        await post.destroy({where:{id}})
        return res.json(post)

    } catch(err){
        next(ApiError.badRequest(err.message))
    }  
}*/

//удаление 
async  del(req, res, next) {
    try {
        const { id } = req.params;
        const post = await Post.findByPk(id);
        
        if (!post) {
            return res.status(404).send('Пост не найден.');
        }
    
        // Путь к изображению поста
        const imgPath = path.resolve(__dirname, '..', 'static', post.img);

        // Проверяем существование файла перед удалением
        try {
            await fs.access(imgPath); // Проверьте, существует ли файл
            
            // Удаление файла асинхронно
            await fs.unlink(imgPath);
        } catch (err) {
            if (err.code !== 'ENOENT') { // Файл отсутствует — это нормально
                console.error(`Ошибка при удалении файла ${imgPath}:`, err);
            }
        }

        // Уничтожаем запись поста
        await post.destroy();

        return res.json(post);
    } catch (err) {
        next(ApiError.badRequest(err.message)); // Передача исключения дальше
    }
}
/* async update(req, res, next){
    try {
        const {id, title, description, userId, } = req.body
        const post  = await Post.findByPk(id)
        //console.log('картинка',post.img)
      if (req.files == null) {
        await post.update({title, description, userId, img: post.img})
        return res.json(post)
      }
        const {img} = req.files
        fs.unlinkSync(path.resolve(__dirname, '..', 'static', post.img))
        const fileName = uuid.v4()+'.jpg'
        img.mv(path.resolve(__dirname, '..', 'static', fileName))
        await post.update({title, description, userId, img: fileName})

        return res.json(post)
    } catch (err) {
        next(ApiError.badRequest(err.message))
        console.log(err)
    }
   
}
    */



async  update(req, res, next) {
    try {
        const { id, title, description, userId } = req.body;
        const post = await Post.findByPk(id);

        if (req.files == null || Object.keys(req.files).length === 0) {
            await post.update({ title, description, userId });
            return res.json(post);
        }

        const { img } = req.files;
        const oldImgPath = path.resolve(__dirname, '..', 'static', post.img);

        // Генерируем новое уникальное имя файла
        const newFileName = `${uuid.v4()}.jpg`;
        const newImgPath = path.resolve(__dirname, '..', 'static', newFileName);

        // Перемещаем загруженный файл
        await img.mv(newImgPath);

        // Асинхронная проверка и удаление старого файла (если он существует)
        try {
            await fs.access(oldImgPath); // Проверяем существование файла
            await fs.unlink(oldImgPath); // Удаляем старый файл
        } catch (err) {
            if (err.code !== 'ENOENT') { // Игнорируем случай отсутствия файла
                console.error(`Ошибка при удалении файла ${oldImgPath}`, err);
            }
        }

        // Обновляем пост новыми данными
        await post.update({
            title,
            description,
            userId,
            img: newFileName
        });

        return res.json(post);
    } catch (err) {
        next(ApiError.badRequest(err.message));
        console.log(err);
    }
}
async getUserPosts(req,res,next){
    try {
       const {userId} = req.params
       console.log('userId-', userId)
       
    const userPosts = await Post.findAll({where:{userId}})
       return res.json(userPosts)
    } catch (error) {
       return  next(ApiError.badRequest(error.massege))
    }
    
 }

}
   
module.exports = new PostController()