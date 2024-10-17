import mongoose from "mongoose";
import { IProduct } from "../models/Iproduct";

const productSchema = new mongoose.Schema<IProduct>({
    title: { type: String, required: true, unique: true },
    desc: { type: String, required: true },
    imageUrl: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    sold: { type: Number, required: true },
    userObj: { type: mongoose.Schema.Types.ObjectId, ref:'users', required: true },
    categoryObj: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'categories'},
    subcategoryObj: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'subCategories'}
}, {timestamps:true})

const ProductCollection = mongoose.model<IProduct>('Products', productSchema);
export default ProductCollection;