const ApiError = require('../errors/apiError')


module.exports = function (err,req, res, next) {
    if (err instanceof ApiError) {
      return  req.status(err.status).json({message:err.massage})
    }
    return res.status(500).json({message: 'Не придвиденная ошибка'} )
}