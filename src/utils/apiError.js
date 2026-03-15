class ApiError extends Error{
    constructor(
        statusCode,
        message = 'Something went wrong',
        errors = [], // if their are additional errors
        stack = "" 
    ){
        super(message);
        this.statusCode = statusCode;
        this.errors = errors; 
        this.data = null; // Initialize data to null
        this.success = false; // Initialize success to false

        if(stack){
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
export {ApiError}