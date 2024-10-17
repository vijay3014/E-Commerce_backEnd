import { Request, Response } from "express";
import { ThrowError } from "../../utils/ErrorUtils";
import * as UserUtils from "../../utils/userUtils";
import { ICart } from "../../models/Icart";
import CartCollection from "../../schemas/cartSchema";
import mongoose from "mongoose";

/**
 * @usage : Create a new Cart
 * @url : http://localhost:9000/api/carts/
 * @params : products[{product, count, price} ] , total, tax, genadTotal
 * @method : POST
 * @access : PRIVATE
 */
export const createCart = async (request: Request, response: Response) => {
    try {
        const theUser = await UserUtils.getUser(request, response);
        if (theUser) {
            const { products, total, tax, grandTotal } = request.body;
            const cart = await CartCollection.findOne({ userObj: theUser._id });
            if (cart) {
                await CartCollection.findOne({ userObj: theUser._id })
            }
            const newCart: ICart = {
                products: products,
                total: total,
                tax: tax,
                grandTotal: grandTotal,
                userObj: theUser._id
            }
            const theCart = await new CartCollection(newCart).save();
            if (!theCart) {
                return ThrowError(response, 400, 'Cart not created');
            }
            const actualCart = await CartCollection.findById(new mongoose.Types.ObjectId(theCart._id)).populate({
                path: 'userObj',
                strictPopulate: false,
            });

            return response.status(200).json({
                data: actualCart,
                message: 'Cart created successfully'
            })
        }
    } catch (error) {
        return ThrowError(response);
    }
};

/**
 * @usage : Get carts info
 * @url : http://localhost:9000/api/carts/me
 * @param : no-param
 * @method : GET
 * @access : private
 * */

export const getMyCart = async (request: Request, response: Response) => {
    try {
        const theUser = await UserUtils.getUser(request, response);
        if (theUser) {
            const theCart: any = await CartCollection.find({userObj: new mongoose.Types.ObjectId(theUser._id)}).populate({
                path: 'products.product',
                strictPopulate: false
            }).populate({
                path: 'userObj',
                strictPopulate: false
            });
            return response.status(200).json({
                msg: "",
                data: theCart
            });
        }
    } catch (error) {
        return ThrowError(response);
    }
};