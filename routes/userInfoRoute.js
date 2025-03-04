const Router = require('express')

 const router = new Router()

 
 router.get('/:userId')
 router.post('/:userId')
 router.delete('/:id')


 module.exports = router