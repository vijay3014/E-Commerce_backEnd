import { Request, Response, Router } from "express";
import * as productController from "../../controller/products/productController";
import { tokenVerifier } from "../../middleware/tokenVarifier";
import { validateForm } from "../../middleware/validateForm";


const productRouter : Router = Router();

/**
 * @usage : Create a Product
 * @url : http://localhost:9000/api/products/
 * @params : title, description, imageUrl, brand, price, quantity, categoryId, subCategoryId
 * @method : POST
 * @access : PRIVATE
 */
productRouter.post('/',tokenVerifier, validateForm, async (request:Request, response:Response) => {
    await productController.createProducts(request, response);
});


/**
 * @usage : get list of products
 * @url : https://localhost:9000/api/products
 * @method : GET 
 * @access : PRIVATE
 */
productRouter.get('/', tokenVerifier, validateForm, async(request:Request, response:|Response)=>{
    await productController.getAllProducts(request, response);
});



/**
 * @usage : get a product by id
 * @url : https://localhost:9000/api/products/:id
 * @method : GET
 **/

productRouter.get('/:id', tokenVerifier, validateForm, async(request:Request, response:Response)=>{
    await productController.getProduct(request, response);
});

/**
 * @usage : update a product by id
 * @url : https://localhost:9000/api/products/:id
 * @method : PUT
 */

productRouter.put('/:id', tokenVerifier, validateForm, async(request:Request, response:Response)=>{
    await productController.updateProduct(request, response);
});

/**
 * @usage : delete a product by id
 * @url : https://localhost:9000/api/products/:id
 * @method : DELETE
 */

productRouter.delete('/:id', tokenVerifier, validateForm, async(request:Request, response:Response)=>{
    await productController.deleteProduct(request, response);
});


export default productRouter;