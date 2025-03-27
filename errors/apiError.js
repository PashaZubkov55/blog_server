class ApiErrors extends Error {
    constructor(status,message){
        super()
        this.status = status
        this.message = message
    }
    static badRequest(message){
        return ApiErrors(404, message)
    }
    static internal(message){
        return ApiErrors(500, message)
    }
    static forbidden(message){
        return ApiErrors(403, message)
    }
}
module.exports = ApiErrors