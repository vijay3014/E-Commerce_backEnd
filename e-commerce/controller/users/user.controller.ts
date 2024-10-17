import { Request, Response } from "express";
import bcryptjs from 'bcrypt';
import jwt from 'jsonwebtoken';
import {IUser} from "../../models/Iuser";
import UserCollection from "../../schemas/userSchema";
import { ThrowError } from "../../utils/ErrorUtils";
import * as UserUtils from '../../utils/userUtils';

/**
 * @usage : Register a User,
 * @url : "https://localhost:9000/api/users/register"
 * @param : username, email, password
 * @method : POST
 * @access : PUBLIC 
 */
export const registerUser =async (request:Request, response:Response) => {
    try{
        let {username, email, password} = request.body;
        
        // check user is exist or not
        let userObj = await UserCollection.findOne({email:email});

        if(userObj){
            return response.status(401).json({message: 'User is already exist...'});
        }

        // hash password
        const salt = await bcryptjs.genSalt(12);
        const hashPassword = await bcryptjs.hash(password,salt);

        // create user
        let newUser : IUser = {
            username:username,
            email:email,
            password:hashPassword
        };

        let user = await new UserCollection(newUser).save();
        if(user){
            return response.status(201).json({message:'Register Sucessfully...'});
        }

    }catch(err){
       return ThrowError(response);
    }    
};

/**
 * @usage : Login a User,
 * @url : "https://localhost:9000/api/users/login"
 * @param : email, password
 * @method : POST
 * @access : PUBLIC 
 */
export const loginUser =async (request:Request, response:Response) => {
    try{
        let {email, password} = request.body;
        
        // verify user email, password
        let userObj = await UserCollection.findOne({email:email});

        if(!userObj){
            return ThrowError(response, 401, 'Invalid credential Email');
        }

        let isMatch :boolean = await bcryptjs.compare(password, userObj.password)

        if(!isMatch){
            return ThrowError(response, 401, 'Invalid password credential' )
        }

        // creat token & send
        let payload = {
            id: userObj._id,
            email: userObj.email
        };
        let secretKey: string | undefined = process.env.JWT_SECRET_KEY;

        if (payload && secretKey) {
            let token = jwt.sign(payload, secretKey, {
                expiresIn: 1000000
            });
            return response.status(200).json({
                msg: 'Login is Success',
                token: token,
                user: userObj
            });
        }

    }catch(err){
       return ThrowError(response);
    }    
};


/**
 * @usage : get a User
 * @url : http://localhost:9000/api/users/me
 * @method : GET
 * @access : PRIVATE
 * @param  request
 * @param response
 */
export const getUser =async (request:Request, response:Response) => {
    try {
        // check  if user exists
        let GetUser = await UserUtils.getUser(request, response)
        if (GetUser) {
            response.status(200).json({
                data: GetUser,
                msg: ""
            });
        }

    } catch (error) {
            return ThrowError(response)        
    }    
};


/**
 * @usage : change password
 * @url : http://localhost:9000/api/users/changePassword
 * @method : POST
 * @access : PRIVATE
 */
export const changePassword =async (request:Request, response:Response) => {
    try {
        const {password} = request.body;
        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password,salt);
        const theUser : any = await UserUtils.getUser(request,response);
        if(theUser) {
            theUser.password = hashPassword;
            const userObj = await theUser.save();
            if(userObj) {
                return response.status(200).json({
                        msg: "Password changed successfully!"
                });
            }
        }
    } catch (error) {
        return ThrowError(response);
    }
};