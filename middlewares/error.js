class ErrorHandler extends Error{

    constructor(message,statusCode){
        super(message)
        this.statusCode=statusCode
    }

}

export const errorMiddleware =(err,req,res,next)=>{
    if (err.name === 'CastError') {
        // Handle invalid ObjectId error
        err.message="invalid Id"
        err.statusCode=400;
        return res.status(err.statusCode).json({
            success:false,
            message:err.message
        })

    }

    err.message=err.message || "Internal Server Error"
    err.statusCode=err.statusCode || 500


    return res.status(err.statusCode).json({
        success:false,
        message:err.message
    })
}

export default ErrorHandler