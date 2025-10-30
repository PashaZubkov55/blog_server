const path = require('path') 
const uuid = require('uuid')
const ApiError = require('../errors/apiError')
const { UserInfo} = require('../models/models')


class InfoUser{
 
   async create(req,res, next){
      try {
         const {name, userId} = req.body
         const {img} = req.files
         const fileName = uuid.v4()+'.jpg'
         img.mv(path.resolve(__dirname, '..', 'static', fileName))
         const userInfo = await  UserInfo.create({name, userId, img: fileName})
         
         return res.json(userInfo)
         
      } catch (error) {
         return  next(ApiError.badRequest(error.massege))
      }
    
     

   }
      async getInfo(req, res, next){
         const {userId} = req.params
         try {
            const user = await UserInfo.findOne({where: {userId}})
            return res.json(user)
         } catch (error) {
            return  next(ApiError.badRequest(error.massege))
         }
      }
      async update(req,res,next){
         
         try {
            const {name, userId} = req.body
         const {img} = req.files
            const fileName = uuid.v4()+'jpg'
            img.md(path.resolve(__dirname,'..', 'static', fileName))
            const user = await UserInfo.update(
               {name, userId, img:fileName},
               { where: { userId } }
            )
            return res.json(user)
   
         } catch (error) {
            return  next(ApiError.badRequest(error.massege))
         }
       
      }
      
      
      async del(){

   }
}
module.exports = new InfoUser()