import { Router, Request, Response } from "express";
import { tokenVerifier } from "../../middleware/tokenVarifier";
import { validateForm } from "../../middleware/validateForm";
import * as cartController from '../../controller/cart/cartController'


const cartRouter : Router = Router();

/**
 * @usage : Create a new Cart
 * @url : http://localhost:9000/api/carts/
 * @params : products[{product, count, price} ] , total, tax, genadTotal
 * @method : POST
 * @access : PRIVATE
 */
cartRouter.post("/add", tokenVerifier, validateForm, async(request:Request, response:Response)=>{
    await cartController.createCart(request, response);
});

/**
 * @usage : Get carts info
 * @url : http://localhost:9000/api/carts/me
 * @param : no-param
 * @method : GET
 * @access : private
 * */

cartRouter.get("/me", tokenVerifier, async(request:Request, response:Response)=>{
    await cartController.getMyCart(request, response);
});

export default cartRouter;