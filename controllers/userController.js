const bcrypt = require('bcrypt')
const{User} = require('../models/models')
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
        }
            const token = genirateJWT(user.id, user.email, user.role)
            return res.json({token})

    }
    async check (req, res, next){
       const token = genirateJWT(req.user.id, req.user.email, req.user.role)
       return res.json({token})
    }
    async del(){
        
    }
}

module.exports = new UserController()