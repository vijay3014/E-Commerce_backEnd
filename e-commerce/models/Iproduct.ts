import mongoose from "mongoose";

export interface IProduct {
    _id?: string;
    title: string;
    desc: string;
    imageUrl: string;
    brand: string;
    price: number;
    quantity: number;
    sold?:number,
    userObj: mongoose.Schema.Types.ObjectId;
    categoryObj: mongoose.Schema.Types.ObjectId;
    subcategoryObj: mongoose.Schema.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}