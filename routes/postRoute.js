const Router = require('express')
 const postController = require('../controllers/postController')
 const router = new Router()

 router.get('/', postController.getAll)
 router.get('/:id', postController.getOne)
 router.post('/',postController.create)
 router.get('/:UserId')
 router.delete('/:id', postController.del)


 module.exports = router