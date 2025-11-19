const Router = require('express')
//const userInfo = require('../controllers/userInfoController')
const userInfoController = require('../controllers/userInfoController')
 const router = new Router()

 
 router.get('/:userId',userInfoController.getInfo)
 router.post('/', userInfoController.create)
 router.put('/:userId', userInfoController.update)
 router.delete('/:userId', userInfoController.del)


 module.exports = router