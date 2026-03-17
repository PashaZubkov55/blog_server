const bcrypt = require('bcrypt')
const path = require('path')
const fs = require('fs/promises')
const{User, Post, UserInfo} = require('../models/models')
const ApiError = require('../errors/apiError')
const jwt = require('jsonwebtoken')
const { sendEmail } = require('../utils/sendEmail')



const genirateJWT  = (id, email, role)=>{
  return  jwt.sign(
    {id, email, role},
     process.env.SECRET_KEY,
     {expiresIn:'24h'}
    )
}
    const resetToken = (id)=>{
        return jwt.sign(
            {id}, 
            process.env.SECRET_KEY_RESET_PASSWORD,
            {expiresIn:'1h'})
    }
class UserController{
    async registration(req,res,next){
        const {email, password, role}  = req.body
        if (!email || !password) {
           return next(ApiError.badRequest('Неверный E-mail или пароль !'))   
        }
        const candidate = await User.findOne({where: {email}})
        if(candidate) {
            return next(ApiError.badRequest('Пользователь с таким email уже существует'))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({email,role, password: hashPassword})
        const userInfo =  await UserInfo.create({name: user.email, userId: user.id})
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
    async check(req, res, next) {
        const token = genirateJWT(req.user.id, req.user.email, req.user.role)
        return res.json({token})
    }

    async forgotPassword(req,res,next){
        const {email} = req.body
        try {
            const user = await User.findOne({where:{email}})
            if (!user) {
                return next(ApiError.badRequest('Пользователь не найден'))  
            }
            const token = resetToken(user.id)
            await user.update({
                resetPasswordToken: token,
                resetPasswordExpires: Date.now() + 3600000, // Токен действует 1 час
              });
            const resetURL = `${process.env.URL_CLIENT}/restoratonPassword/${token}`
            await sendEmail(email,'востоновление пароля', `Пожалуйста перейдите по ссылке востоновление пароля ${resetURL}`)
          
           return res.json(user)
        } catch (error) {
          
           console.log(error)
           
        }
       

    }
    resetPassword = async (req, res, next) => {
        const { token } = req.params;
        const { newPassword } = req.body;
      
        try {
          // Декодируем токен и получаем ID пользователя
          const decodedToken = jwt.verify(token, process.env.SECRET_KEY_RESET_PASSWORD);
      
          // Находим пользователя по токену
          const user = await User.findOne({ where: { resetPasswordToken: token } });
          if (!user) return next(ApiError.badRequest('Устаревший токен '))
      
          // Проверяем срок действия токена
          if (Date.now() >= user.resetPasswordExpires) return  next(ApiError.badRequest('Срок действия ссылки истек'))
      
          // Хешируем новый пароль
          const saltRounds = 5;
          const hash = await bcrypt.hash(newPassword, saltRounds);
      
          // Обновляем пароль и очищаем токен восстановления
          await user.update({
            password: hash,
            resetPasswordToken: null,
            resetPasswordExpires: null,
          });
      
          //res.status(200).send('Пароль успешно изменён.');
          return res.json(user)
        } catch (err) {
         console.log(err)
            //return  next(ApiError.badRequest('Ошибка сервера '))
        }
      };



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
                    if (fileName !== 'camera.jpg') {
                        const filePath = path.resolve(__dirname, '..', 'static', fileName)
                        return fs.unlink(filePath).catch(()=>{})
                    }
                   // const filePath = path.resolve(__dirname, '..', 'static', fileName)
                  
                   
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