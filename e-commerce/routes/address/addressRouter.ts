import { Request, Response, Router } from "express";
import { tokenVerifier } from "../../middleware/tokenVarifier";
import { validateForm } from "../../middleware/validateForm";
import * as addressController from '../../controller/address/addressController'

const addressRouter: Router = Router();

/**
 * @usage : Create New Address
 * @url : http://localhost:9000/api/address/new
 * @param: mobile, flat, landmark, street, city, state, country, pincode
 * @method : POST
 * @access : PRIVATE
 */

addressRouter.post("/new", tokenVerifier, validateForm,async (request:Request, response: Response) => {
    await addressController.createAddress(request, response); 
});

/**
 * @usage : Update Address
 * @url : http://localhost:9000/api/address/:addressId
 * @parms : mobile, flat, landmark, street, city, state, country, pinCode
 * @method : PUT
 * @access : PRIVATE
 */

addressRouter.put("/:addressId", tokenVerifier, validateForm,async (request:Request, response: Response) => {
    await addressController.updateAddress(request, response); 
});

/**
 * @usage : GET Address
 * @url : http://localhost:9000/api/address/me
 * @parms : no-param
 * @method : GET
 * @access : PRIVATE
 */

addressRouter.get("/me", tokenVerifier, async (request:Request, response: Response) => {
    await addressController.getAddress(request, response); 
});

/**
 * @usage : Delete Address
 * @url : http://localhost:9000/api/address/:addressId
 * @parms : addressId
 * @method : Delete
 * @access : PRIVATE
 */

addressRouter.delete("/:addressId", tokenVerifier, async (request:Request, response: Response) => {
    await addressController.deleteAddress(request, response); 
});

export default addressRouter;