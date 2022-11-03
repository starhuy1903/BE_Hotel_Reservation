function createError(status, message){
    const err = new Error()
    err.status = status
    err.message = message
    return err
}

module.exports = createError

/*export const createError = (status, message) => { 
    const err = new Error()
    err.status = status
    err.message = message
    return err
}*/
