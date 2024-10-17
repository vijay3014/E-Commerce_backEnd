import { Request, Response, Router } from "express";
import { tokenVerifier } from "../../middleware/tokenVarifier";
import { validateForm } from "../../middleware/validateForm";
import * as categoriesController from '../../controller/categories/categoriesController';

const categoriesRouter: Router = Router();

/**
 * @usage : Create a new category
 * @url : http://localhost:9000/api/categories
 * @params : name, desc
 * @method : POST,
 * @access : PRIVATE
 */
categoriesRouter.post('/',tokenVerifier,validateForm, async(request: Request, response: Response)=>{
    await categoriesController.createCategory(request, response);
});

/**
 * @usage : create a sub category
 * @url : http://localhost:9000/api/categories/:categoryId
 * @param : name, desc
 * @method : POST,
 * @access : PRIVATE
 */
categoriesRouter.post('/:categoryId',tokenVerifier,validateForm, async (requset:Request, response: Response)=>{
    await categoriesController.createSubCategory(requset, response);
})



/**
 * @usage : Get all categories
 * @url : http://localhost:9000/api/categories
 * @method : GET,
 */

categoriesRouter.get('/',tokenVerifier, async(request: Request, response: Response)=>{
    await categoriesController.getAllCategories(request, response);
});

export default categoriesRouter;