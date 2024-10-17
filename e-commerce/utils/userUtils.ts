import {Request, Response} from 'express';
import mongoose from 'mongoose';
import { ThrowError } from './ErrorUtils';
import UserCollection from '../schemas/userSchema';
import jwt  from 'jsonwebtoken';

export const getUser = async (request:Request, response:Response) => {
    try{
            let theUser : any = request.headers['user'];
            // console.log(theUser);
            theUser = await jwt.verify(theUser, process.env.JWT_SECRET_KEY as string) 
            // console.log(theUser, '.............theuser');
            const userId = theUser.id;
            // console.log('userId:', userId);
            if(!userId){
                return response.status(401).json({
                    message: 'Invalid User Request'
                })
            }
        const mongoId = new mongoose.Types.ObjectId(userId);
        let userObj : any = await UserCollection.findById(mongoId);
        if(!userObj){
            return ThrowError(response,404,'User is not found....');
        }
        return userObj;
    }catch(error){
        return ThrowError(response)
    }

}