const path = require('path') 
const uuid = require('uuid')
const fs = require('fs')
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
            const userInfo = await UserInfo.findByPk(userId)
            console.log(userInfo)
            if (req.files == null) {
               userInfo.update(
                  {name, userId, img:userInfo.img},
                  { where: { userId } }
               )
               return res.json(userInfo)
               
            }
          
            fs.unlinkSync(path.resolve(__dirname, '..', 'static', userInfo.img))
            const {img} = req.files
            const fileName = uuid.v4()+'.jpg'
            img.mv(path.resolve(__dirname,'..', 'static', fileName))
            userInfo.update(
               {name, userId, img:fileName},
               { where: { userId } }
            )
            return res.json(userInfo)
   
         } catch (error) {
            console.log(error)
            return  next(ApiError.badRequest(error.massege))
         }
       
      }
      
      
      async del(){

   }
}
module.exports = new InfoUser()