 const Router = require('express')
 const userRouter = require('./userRoute')
 const postRouter = require('./postRoute') 
 const userInfoRoute = require('./userInfoRoute') 


 const router = new Router()

router.use('/users',userRouter)
router.use('/posts', postRouter)
router.use('/userInfo',userInfoRoute)





 module.exports = router