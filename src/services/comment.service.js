'use strict'

const comment = require('../models/comment.model')
const { convertToObjectId } = require('../utils')
const { findProduct } =  require('../repositories/product.repo')
const { NotFoundError } = require('../core/error.response')

/**
    key features: Comment service
    + add comment [User | Shop]
    + get a list comments [User | Shop]
    + delete a comment [User | Shop | Admin]
 */
class CommentService {

    static async createComment({
        productId, userId, content, parentCommenId = null
    }) {
        const comment = new Comment({
            comment_productId: productId,
            comment_userId: userId,
            comment_content: content,
            comment_parentId: parentCommenId
        })

        let rightValue
        if (parentCommenId) {
            // rely
            const parentComment = await Comment.findById(parentCommenId)
            if (parentComment) throw new Error('Parent comment not found')

            rightValue = parentComment.comment_right
            // updateMany comments
            await Comment.updateMany({
                comment_productId: convertToObjectId(productId),
                comment_right: { $gte: rightValue }
            }, {
                $inc: { comment_right: 2 }
            })

            await Comment.updateMany({
                comment_productId: convertToObjectId(productId),
                comment_left: { $gte: rightValue }
            }, {
                $inc: { comment_left: 2 }
            })

            parentComment.comment_right = rightValue + 1
            await parentComment.save()
        } else {
            const maxRightValue = await Comment.findOne({
                comment_productId: convertToObjectId(productId)
            }, 'comment_right', {sort: {comment_right: -1}})
            rightValue = maxRightValue ? maxRightValue.comment_right + 1 : 1
        }

        // insert comment
        comment.comment_left = rightValue
        comment.comment_right = rightValue + 1

        await comment.save()
        return comment
    }

    static async getCommentsByParentId({
        productId,
        parentCommentId = null,
        limit = 50,
        offset = 0 // skip
    }) {
        const parent = parentCommentId 
            ? await Comment.findById(parentCommentId)
            : await Comment.findOne({
                comment_left: 1,
                comment_productId: convertToObjectId(productId)
            })

        if (!parent) throw new NotFoundError('Parent comment not found')

        const comments = await Comment.find({
            comment_productId: convertToObjectId(productId),
            comment_parentId: convertToObjectId(parentCommentId),
            comment_left: { $gt: parent.comment_left },
            comment_right: { $lte: parent.comment_right }
        }).select({
            comment_content: 1,
            comment_left: 1,
            comment_right: 1,
            comment_parentId: 1,
        }).sort({ comment_left: 1 }).skip(offset).limit(limit)

        return comments
    }

    static async deleteComment({ commentId, productId }) {
        // check the product exists in the database
        const foundProduct = await findProduct({productId})

        if (!foundProduct) throw new NotFoundError('Product not found')

        // 1. Xac dinh gia tri left va right
        const comment = await Comment.findById(commentId)
        if (!comment) throw new NotFoundError('Comment not found')

        const leftValue = comment.comment_left
        const rightValue = comment.comment_right
        // 2. Tinh toan width
        const width = rightValue - leftValue + 1
        // 3. Xoa tat ca commentId con
        await Comment.deleteMany({
            comment_productId: convertToObjectId(productId),
            comment_left: { $gte: leftValue },
            comment_right: { $lte: rightValue }
        })
        // 4. Update lai left va right cua cac comment con
        await Comment.updateMany({
            comment_productId: convertToObjectId(productId),
            comment_right: { $gt: rightValue }
        }, {
            $inc: { comment_right: -width }
        })

        await Comment.updateMany({
            comment_productId: convertToObjectId(productId),
            comment_left: { $gt: rightValue }
        }, {
            $inc: { comment_left: -width }
        })

    }
}

module.exports = CommentService