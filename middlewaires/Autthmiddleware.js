const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
 if (res.method === 'OPTIONS') {
    next()    
 }
 try {
    const token = req.headers.autorization.split(' ')[1]
    if (!token) {
        return res.status(401).json({massage: 'Не авторизован !'})
    }
    const decodet = jwt.verify(token, process.env.SECRET_KEY)
    req.user = decodet
    next()
 } catch (error) {
    res.status(401).json({massage: 'Не авторизован !'})
    
 }
    
}