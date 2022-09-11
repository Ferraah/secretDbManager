class ApiError{
    constructor(code, message){
        this.code = code;
        this.message;
    }

    static badRequest(msg){
        return new ApiError(400, msg)
    }

    static internal(msg){
        return new ApiError(400, msg)
    }
}

module.exports = {ApiError}