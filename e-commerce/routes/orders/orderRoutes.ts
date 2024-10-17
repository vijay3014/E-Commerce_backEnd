import { Router, Request, Response } from "express";
import { tokenVerifier } from "../../middleware/tokenVarifier";
import { validateForm } from "../../middleware/validateForm";
import * as orderController from "../../controller/orders/orderController";

const orderRouter: Router = Router();

/**
 * @usage : place an order
 * @url : http://localhost:9000/api/orders/place
 * @params : products[{product, count,price}],total,tax,grandTotal,paymentType
 * @method : POST
 * @access : PRIVATE
 */

orderRouter.post('/place', tokenVerifier, validateForm, async(request:Request, response:Response)=>{
    await orderController.placeOrder(request,response);
});

/**
 * @usage : get all orders
 * @url : http://localhost:9000/api/orders/all
 * @param : no-param
 * @method : GET
 * @access : Private
 * */

orderRouter.get('/all', tokenVerifier, async(request:Request, response:Response)=>{
    await orderController.getAllOrders(request,response);
});

/**
 * @usage : get my order
 * @url : http://localhost:9000/api/orders/me
 * @params : no-params
 * @method : GET
 * @access : Private
 * */

orderRouter.get('/me', tokenVerifier, async(request:Request, response:Response)=>{
    await orderController.getMyOrder(request,response);
});

/**
 * @usage : update order status
 * @url : http://localhost:9000/api/orders/:orderId
 * @param : orderId
 * @method : POST
 * @access : private
 */

orderRouter.post('/:orderId', tokenVerifier, async(request:Request, response:Response)=>{
    await orderController.updateOrderStatus(request,response);
});

export default orderRouter;