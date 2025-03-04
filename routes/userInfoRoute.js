const Router = require('express')
const userInfo = require('../controllers/userInfoController')
const userInfoController = require('../controllers/userInfoController')
 const router = new Router()

 
 router.get('/:userId',userInfoController.getInfo)
 router.post('/:userId', userInfoController.create)
 router.delete('/:id', userInfoController.del)


 module.exports = router