// Checks a request body against a schema and stops the request when it is invalid.
export default function postValidate(schema){
    return (req,res,next)=>{
        console.log(req.body)
        const result = schema.safeParse(req.body)
        if(!result.success){
            return next(result.error)
        }

        req.validatedBody = result.data

        next()
    }
}