const Router = require('express')
const userController = require('../controllers/userController')
const autthMiddleware = require('../middlewaires/Autthmiddleware')
 const router = new Router()

 router.post('/registration',userController.registration)
 router.post('/login',userController.login)
 router.get('/auth',autthMiddleware, userController.check)
 router.delete('/:id',userController.del)


 module.exports = router