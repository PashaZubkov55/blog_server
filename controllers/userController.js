const bcrypt = require('bcrypt')
const{User} = require('../models/models')
const ApiError = require('../errors/apiError')
const jwt = require('jsonwebtoken')

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

        const token = jwt.sign({id: user.id, email, role}, process.env.SECRET_KEY,{expiresIn:'24h'})
        return res.json({token})
    }
    async login(){

    }
    async check (){
        
    }
    async del(){
        
    }
}

module.exports = new UserController()