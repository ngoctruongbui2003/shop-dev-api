'use strict'

const { unGetSelectData } = require("../../utils")
const discount = require("../discount.model")

const findAllDiscountCodeUnSelect = async({
    limit = 50, page = 1, sort = 'ctime',
    filter, unSelect
}) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const documents = await discount.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(unGetSelectData(unSelect))
    .lean()

    return documents
}

const findAllDiscountCodeSelect = async({
    limit = 50, page = 1, sort = 'ctime',
    filter, select, model
}) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const documents = await model.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(unGetSelectData(select))
    .lean()

    return documents
}

const findDiscount = async({ filter }) => {
    return await discount.findOne(filter).lean()
}

const updateDiscountById = async({ discount_id, payload, isNew = true }) => {
    return await discount.findByIdAndUpdate(discount_id, payload, { new: isNew })
}

module.exports = {
    findAllDiscountCodeUnSelect,
    findAllDiscountCodeSelect,
    findDiscount,
    updateDiscountById
}
