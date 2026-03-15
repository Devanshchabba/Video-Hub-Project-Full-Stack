class ApiResponse{
    constructor(statusCode,data ,message = "Success"){
        this.statusCode=statusCode
        this.data = data 
        this.message = message 
        this.success = statusCode<400 //statusCode for response used be < 400
    }
}
export  {ApiResponse}