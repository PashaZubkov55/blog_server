const path = require('path') 
const uuid = require('uuid')
const fs = require('fs').promises
const ApiError = require('../errors/apiError')
const { UserInfo} = require('../models/models')


class InfoUser{
 
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
            if (req.files == null) {
              await userInfo.update(
                  {name, userId, img:userInfo.img},
                  { where: { userId } }
               )
               return res.json(userInfo)
               
            }
            if (userInfo.img !== 'camera.jpg') {
               await fs.unlink(path.resolve(__dirname, '..', 'static', userInfo.img))
            
               const {img} = req.files
               const fileName = uuid.v4()+'.jpg'
               await img.mv(path.resolve(__dirname,'..', 'static', fileName))
             await  userInfo.update(
                  {name, userId, img:fileName},
                  { where: { userId } }
               )
               return res.json(userInfo)
            }
            const {img} = req.files
               const fileName = uuid.v4()+'.jpg'
              await img.mv(path.resolve(__dirname,'..', 'static', fileName))
              await userInfo.update(
                  {name, userId, img:fileName},
                  { where: { userId } }
               )
               return res.json(userInfo)
           
   
         } catch (error) {
            console.log(error)
            return  next(ApiError.badRequest(error.massege))
         }
       
      }
         
    /*
      
      async  update(req, res, next) {
          try {
              const { name, userId } = req.body;
              let { img } = req.files; // Необязательно присваивать прямо здесь
      
              const userInfo = await UserInfo.findByPk(userId);
      
              if (!userInfo) {
                  return res.status(404).json({ message: 'Пользователь не найден.' });
              }
      
              // Проверяем наличие загруженного файла
              if (img && img.size > 0) {
                  // Генерируем новое имя файла
                  const fileName = `${uuid.v4()}.jpg`;
                  const uploadPath = path.resolve(__dirname, '..', 'static', fileName);
      
                  // Перемещение файла
                  await img.mv(uploadPath);
      
                  // Если у пользователя было другое изображение кроме дефолтного ('camera.jpg')
                  if (userInfo.img !== 'camera.jpg') {
                      const oldImagePath = path.resolve(__dirname, '..', 'static', userInfo.img);
                      
                      // Проверяем доступность файла перед удалением
                      try {
                          await fs.access(oldImagePath);
                          await fs.unlink(oldImagePath); // Безопасно удаляем старый файл
                      } catch (err) {
                          if (err.code !== 'ENOENT') { // игнорируем отсутствие файла
                              console.error(`Ошибка при удалении файла ${oldImagePath}:`, err);
                          }
                      }
                  }
      
                  // Обновляем поля профиля, включая новую картинку
                  await userInfo.update({ name, img: fileName }, { where: { userId } });
              } else {
                  // Если файл не передан, просто обновляем профиль
                  await userInfo.update({ name }, { where: { userId } });
              }
      
              return res.json(userInfo);
          } catch (err) {
              next(ApiError.badRequest(err.message));
              console.error(err);
          }
      }
          */
      
      
      async del(){

   }
}
module.exports = new InfoUser()