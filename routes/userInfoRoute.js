const Router = require('express')
const userInfoController = require('../controllers/userInfoController')
 const router = new Router()

 
 router.get('/:userId',userInfoController.getInfo)
 router.put('/:userId', userInfoController.update)
 router.delete('/:userId', userInfoController.del)


 module.exports = router