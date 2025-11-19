const bcrypt = require('bcrypt')
const path = require('path')
const fs = require('fs/promises')
const{User, Post, UserInfo} = require('../models/models')
const ApiError = require('../errors/apiError')
const jwt = require('jsonwebtoken')



const genirateJWT  = (id, email, role)=>{
  return  jwt.sign(
    {id, email, role},
     process.env.SECRET_KEY,
     {expiresIn:'24h'}
    )
}
class UserController{
    async registration(req,res,next){
        const {email, password, role}  = req.body
        if (!email || !password) {
           return next(ApiError.badRequest('Неверный E-mail или пароль !'))   
        }
        const candidate = await User.findOne({where: {email}})
        if (candidate) {
            return next(ApiError.badRequest('Пользователь с таким email уже существует'))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({email,role, password: hashPassword})

        const token = genirateJWT(user.id, user.email, user.role)
        return res.json({token})
    }
    async login(req, res, next){
        const {email, password} = req.body
        const user = await User.findOne({where: {email}})
        if (!user) {
            return next(ApiError.badRequest('Пользователь не найден'))
        }
        let compairePassword = bcrypt.compareSync(password, user.password)
        if (!compairePassword) {
            return next(ApiError.badRequest('Пароль не верный ! '))
        }   const id = user.id
            const token = genirateJWT(user.id, user.email, user.role)
            return res.json({ id ,token})

    }
    async check (){
        
    }
    async del(req, res, next){
        try {
            
            const {id} = req.params
            Number(id)
            console.log(`id user- ${id}`)
            const user = await User.findByPk(id)
            console.log(`пользователь - ${user}`)
            const posts  = await Post.findAll({where:{userId:id}})
            const userInfo = await UserInfo.findOne({where:{userId: id}})
            console.log(`посты пользователя - ${posts}`)
            console.log(`информация о пользователе  - ${userInfo}`)
            const allIMG = []
            if (posts && userInfo) {
                 // формируем масив из картиное
                allIMG.push(
                    ...posts.filter(post=> post.img).map(post=> post.img),
                    userInfo? userInfo.img: null
                ) 

                console.log(`все фотки - ${allIMG}`)
            
                // удаляем все  картинки 
                await Promise.all(allIMG.map(fileName=>{
                    const filePath = path.resolve(__dirname, '..', 'static', fileName)
                    return fs.unlink(filePath).catch(()=>{})
                   
                }))
                await user.destroy({where:{id:id}})
                return res.json(user)
        }
            
             await user.destroy({where:{id:id}})
            return res.json(user)
           
           
        }
        catch (error) {
            return next(ApiError.badRequest('Пользователь не найден! '))
        }
        
    }
}

module.exports = new UserController()