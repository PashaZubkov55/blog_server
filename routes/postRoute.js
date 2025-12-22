const Router = require('express')
 const postController = require('../controllers/postController')
 const router = new Router()

 router.get('/:title?/all', postController.getAll)
 router.get('/:id', postController.getOne)
 router.get('/:title/search', postController.searchPost)
 router.post('/',postController.create)
 router.get('/:userId/userPosts', postController.getUserPosts)
 router.put('/:id',postController.update)
 router.delete('/:id', postController.del)


 module.exports = router