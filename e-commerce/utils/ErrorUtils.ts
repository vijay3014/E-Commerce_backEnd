import { Response } from "express";

export const ThrowError = (response:Response, statusCode?:number, msg?:string) =>{
    return response.status(statusCode ? statusCode : 500).json({
        msg: msg ?msg : 'Server Error',
        data: null
    })
}