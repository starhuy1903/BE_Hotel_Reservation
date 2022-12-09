const pagination = (models, page) =>{
    return models.slice((page-1)*process.env.PER_PAGE, process.env.PER_PAGE*(page))
    
}

module.exports = {pagination}