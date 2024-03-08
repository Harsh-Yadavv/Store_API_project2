const product = require('../models/product')

const getAllProductsStatic = async (req, res) => {
    const products = await product.find({})
    res.status(200).json({products})
}
const getAllProducts = async (req, res) => {
    const {featured, company, name, sort, createdAt, fields, numericFilters} = req.query
    const queryObject = {}

    if(featured) {
        queryObject.featured = featured === 'true'? true : false
    }
    if (company) {
        queryObject.company = company
    }
    if (name) {
        queryObject.name = { $regex: name, $options: 'i'} //for searching through any letter
    }
    if (numericFilters) {
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte',
        }
        const regEx = /\b(>|>=|=|<|<=)\b/g
        let filters = numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-`
        )
        const options = ['price', 'rating'];
        filters = filters.split(',').forEach((item) => {
            const [field, operator, value] = item.split('-')
            if (options.includes(field)) {
                queryObject[field] = {[operator]: Number(value)}
            }
        });

        console.log(filters)
    }
    console.log(queryObject)
    let result = product.find(queryObject)

    //sort
    if (sort) {
        const sortList = sort.split(',').join(' ');
        result = result.sort(sortList)
    } else {
        result = result.sort(createdAt)
    }

    if (fields) {
        const fieldList = fields.split(',').join(' ')
        result = result.select(fieldList)
    }
    
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 5
    const skip = (page - 1) * limit;

    result = result.skip(skip).limit(limit)
    //Logic for pagination
    //23 items then first page shows 5 items and skips 0 items
    //if user wants 2nd page then (2-1)*5= 5 items are skipped and 6th to 10th are shown
    //total pages is 5 with last page showing 3 items after skipping (5-1)*5 = 20 items

    const products = await result
    res.status(200).json({products, nbHits: products.length})
}

module.exports = {
    getAllProducts,
    getAllProductsStatic,
}