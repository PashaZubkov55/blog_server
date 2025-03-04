const Router = require('express')

 const router = new Router()

 router.get('/')
 router.get('/:id')
 router.post('/')
 router.delete('/:id')


 module.exports = router