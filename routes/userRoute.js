const Router = require('express')
const userController = require('../controllers/userController')
const Autthmiddleware = require('../middlewaires/Autthmiddleware')
 const router = new Router()

 router.post('/registration',userController.registration)
 router.post('/login',userController.login)
 router.get('/auth',  Autthmiddleware, userController.check)
 router.delete('/:id',userController.del)
 router.post('/forgot-password', userController.forgotPassword)
 router.put('/reset-password/:token', userController.resetPassword)



 module.exports = router