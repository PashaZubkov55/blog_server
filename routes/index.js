 const Router = require('express')
 const userRouter = require('./userRoute')
 const postRouter = require('./postRoute') 
 const userInfoRoute = require('./userInfoRoute') 


 const router = new Router()

router.use('/user',userRouter)
router.use('/post', postRouter)
router.use('/userInfo',userInfoRoute)





 module.exports = router