import mongoose from "mongoose";
import {INewCartProduct} from "./Icart";

export interface IOrder {
    products: INewCartProduct[];
    total: number;
    tax: number;
    grandTotal: number;
    paymentType: string;
    orderStatus?: string,
    orderBy: mongoose.Schema.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}