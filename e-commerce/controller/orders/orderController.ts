import { Request, Response } from "express";
import { ThrowError } from "../../utils/ErrorUtils";
import * as UserUtils from "../../utils/userUtils";
import {ICart} from '../../models/Icart';
import CartCollection from "../../schemas/cartSchema";
import {IOrder} from '../../models/Iorder';
import OrderCollection from "../../schemas/orderSchema";
import mongoose from "mongoose";

/**
 * @usage : place an order
 * @url : http://localhost:9000/api/orders/place
 * @params : products[{product, count,price}],total,tax,grandTotal,paymentType
 * @method : POST
 * @access : PRIVATE
 */
export const placeOrder = async (request: Request, response: Response)=>{
    try {
        const theUser : any = await UserUtils.getUser(request,response);
        if(theUser){
            const {products,total,tax,grandTotal,paymentType} = request.body;
            const newOrder : IOrder = {
                products: products,
                total: total,
                tax: tax,
                grandTotal: grandTotal,
                orderBy: theUser._id,
                paymentType: paymentType
            };
            const theOrder = await new OrderCollection(newOrder).save();
            if(!theOrder){
                return ThrowError(response,400, 'Order creation failed')
            }
            const actualOrder = await OrderCollection.findById(new mongoose.Types.ObjectId(theUser._id)).populate({
                path:'userObj',
                strictPopulate: false
            })
            return response.status(200).json({
                msg: 'Order created successfully',
                data : actualOrder
            })   
        }
    } catch (error) {
        return ThrowError(response);
    }
};

/**
 * @usage : get all orders
 * @url : http://localhost:9000/api/orders/all
 * @param : no-param
 * @method : GET
 * @access : Private
 * */ 

export const getAllOrders = async (request : Request, response : Response) =>{
    try {
        const theUser : any = await UserUtils.getUser(request,response);
        if(theUser){
            const orders : IOrder[] | any = await OrderCollection.find().populate({
                path:'products.product',
                strictPopulate: false
            }).populate({
                path:'userObj',
                strictPopulate: false
            });

            return response.status(200).json({
                msg:'',
                data:orders
            });
        }
        
    } catch (error) {
        return ThrowError(response);
    }
};

/**
 * @usage : get my order
 * @url : http://localhost:9000/api/orders/me
 * @params : no-params
 * @method : GET
 * @access : Private
 * */

export const getMyOrder = async (request : Request, response : Response) =>{
    try {
        const theUser : any = await UserUtils.getUser(request,response);
        if(theUser){
            const orders : IOrder[] | any = await OrderCollection.find({userObj: new mongoose.Types.ObjectId(theUser._id)}).populate({
                path:'products.product',
                strictPopulate: false
            }).populate({
                path:'userObj',
                strictPopulate: false
            });

            return response.status(200).json({
                msg:'',
                data:orders
            });
        }
        
    } catch (error) {
        return ThrowError(response);
    }
};

/**
 * @usage : update order status
 * @url : http://localhost:9000/api/orders/:orderId
 * @param : orderId
 * @method : POST
 * @access : private
 */

export const updateOrderStatus = async (request : Request, response : Response) =>{
    try {
        const {orderStauts} = request.body;
        const {orderId} = request.params;
        const mongoOrderId = new mongoose.Types.ObjectId(orderId);
        const theUser : any = await UserUtils.getUser(request,response);
        if(theUser){
            const theOrder : IOrder | any = await OrderCollection.findById(mongoOrderId);
            if(!theOrder){
                return ThrowError(response,400, 'Order not found')
            }
            theOrder.orderStauts = orderStauts;
            await theOrder.save();
            const theActualOrder  = await OrderCollection.findById(mongoOrderId).populate({
                path:'products.product',
                strictPopulate: false
            }).populate({
                path:'orderBy',
                strictPopulate: false
            });

            return response.status(200).json({
                data : theActualOrder,
                msg: 'Order was Upadated!'
            });
        }
        
    } catch (error) {
        return ThrowError(response);
    }
};