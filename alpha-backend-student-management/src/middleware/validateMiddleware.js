// Checks query parameters against a schema before the list request continues.
const validateMiddleware = schema => (req, res, next) => {
  try {
    const result = schema.safeParse(req.query)
    if (!result.success) {
      return next(result.error)
    } else {
      req.validatedQuery = result.data
      next()
    }
  }catch (error) {
    next(error)
  }

}
export default validateMiddleware
