import { Router, Request, Response } from "express";
import * as userController from "../../controller/users/user.controller";
import { validateForm } from "../../middleware/validateForm";
import { tokenVerifier } from "../../middleware/tokenVarifier";

const userRouter: Router = Router();


/**
 * @usage : Register a User
 * @url : http://localhost:9000/api/users/register
 * @params : username , email , password
 * @method : POST
 * @access : PUBLIC
 */
userRouter.post('/register',async (request:Request, response:Response) => {
    await userController.registerUser(request,response);
})

/**
 * @usage : login a User
 * @url : http://localhost:9000/api/users/login
 * @params : email , password
 * @method : POST
 * @access : PUBLIC
 */
userRouter.post('/login',async (request:Request, response:Response) => {
    await userController.loginUser(request,response);
})

/**
 * @usage : get a User
 * @url : http://localhost:9000/api/users/me
 * @method : GET
 * @access : PRIVATE
 * @param  request
 * @param response
 */
userRouter.get('/me',async (request:Request, response:Response) => {
    await userController.getUser(request,response);
});

/**
 * @usage : change the password
 * @url : http://localhost:9000/api/users/changePassword
 * @params : password
 * @method : POST
 * @access : PRIVATE
 */
userRouter.post("/changePassword", tokenVerifier, validateForm, async (request: Request, response: Response) => {
    await userController.changePassword(request, response);
});

export default userRouter;