import { Request, Response } from 'express';
import { ThrowError } from '../../utils/ErrorUtils';
import * as UserUtils from '../../utils/userUtils';
import { IProduct } from '../../models/Iproduct';
import ProductCollection from '../../schemas/productSchema';
import mongoose from 'mongoose';



/**
 * @usage : Create a Product
 * @url : http://localhost:9000/api/products/
 * @params : title, description, imageUrl, brand, price, quantity, categoryId, subCategoryId
 * @method : POST
 * @access : PRIVATE
 */
export const createProducts = async (request: Request, response: Response) => {
    try {
        const { title, desc, imageUrl, brand, price, quantity, categoryId, subCategoryId } = request.body;
        const theUser: any = await UserUtils.getUser(request, response);

        if (theUser) {
            const theProuct: IProduct | undefined | null = await ProductCollection.findOne({ title: title });
            if (theProuct) {
                return ThrowError(response, 401, 'The Product is already Exists...');
            }
            const newProduct: IProduct = {
                title: title,
                desc: desc,
                imageUrl: imageUrl,
                brand: brand,
                price: price,
                quantity: quantity,
                categoryObj: categoryId,
                subcategoryObj: subCategoryId,
                userObj: theUser._id
            };
            const createProduct = await new ProductCollection(newProduct).save();
            if (createProduct) {
                return response.status(200).json({
                    data: createProduct,
                    message: 'Product Created Successfully...'
                })
            }
        }

    } catch (error) {
        return ThrowError(response);
    }
};

/**
 * @usage : Get All Products
 * @url : http://localhost:9000/api/products/
 * @method : GET
 */
export const getAllProducts = async (request: Request, response: Response) => {
    try {
        const theUser: any = await UserUtils.getUser(request, response);
        if (theUser) {
            const allProducts: IProduct[] = await ProductCollection.find().populate({ path: "userObj", strictPopulate: false }).populate({ path: "categoryObj", strictPopulate: false }).populate({ path: "subcategoryObj", strictPopulate: false });
            return response.status(200).json({
                data: allProducts,
                message: 'Products Retrieved Successfully...'
            })
        }
    } catch (error) {
        return ThrowError(response);
    }
};

/**
 * @usage : get a product
 * @url : http://localhost:9000/products/:product_id
 * @method : GET
 */
export const getProduct = async (request: Request, response: Response) => {
    try {
        const { product_id } = request.params;
        const mongoProductId = new mongoose.Types.ObjectId(product_id);
        const theUser: any = await UserUtils.getUser(request, response);
        if (theUser) {
            const theProduct: IProduct | undefined | null = await ProductCollection.findById(mongoProductId).populate({ path: "userObj", strictPopulate: false }).populate({ path: "categoryObj", strictPopulate: false }).populate({ path: "subCategoryObj", strictPopulate: false });
            if (!theProduct) {
                return ThrowError(response, 404, 'Product Not Found...');
            }
            return response.status(200).json({
                data: theProduct,
                message: 'Product Retrieved Successfully...'
            })
        }
    } catch (error) {
        return ThrowError(response);
    }
};

/**
 * @usage : Update a product
 * @url : http://localhost:9000/products/:product_id
 * @method : PUT
 */
export const updateProduct = async (request: Request, response: Response) => {
    try {
        const { title, desc, imageUrl, brand, price, quantity, categoryId, subCategoryId } = request.body;
        const { product_id } = request.params;
        const mongoProductId = new mongoose.Types.ObjectId(product_id);
        const theUser: any = await UserUtils.getUser(request, response);
        if (theUser) {
            const theProduct: IProduct | undefined | null = await ProductCollection.findById(mongoProductId);
            if (!theProduct) {
                return ThrowError(response, 404, 'Product not found');
            }
            const newProduct: IProduct = {
                title: title,
                desc: desc,
                imageUrl: imageUrl,
                brand: brand,
                price: price,
                quantity: quantity,
                categoryObj: categoryId,
                subcategoryObj: subCategoryId,
                userObj: theUser._id
            };

            const updateProduct = await ProductCollection.findByIdAndUpdate(mongoProductId, { $set: newProduct }, { new: true });
            if (updateProduct) {
                return response.status(200).json({
                    data: updateProduct,
                    message: 'Product Updated Successfully...'
                })
            }
        }
    } catch (error) {
        return ThrowError(response);
    }
};

/**
 * @usage : Delete a product
 * @url : http://localhost:9000/products/:product_id
 * @param : no-param
 * @method : DELETE
 * @access : PRIVATE
*/

export const deleteProduct = async (request: Request, response: Response) => {
    try {
        const { product_id } = request.params;
        const mongoProductId = new mongoose.Types.ObjectId(product_id);
        const theUser: any = await UserUtils.getUser(request, response);

        if (theUser) {
            const theProduct: IProduct | undefined | null = await ProductCollection.findById(mongoProductId).populate({
                path: "userObj",
                strictPopulate: false
            }).populate({
                path: "categoryObj",
                strictPopulate: false
            }).populate({
                path: "subCategoryObj",
                strictPopulate: false
            });
            if (!theProduct) {
                return ThrowError(response, 404, 'Product not found');
            }

            const deleteProduct = await ProductCollection.findByIdAndDelete(mongoProductId);
            if (deleteProduct) {
                return response.status(200).json({
                    data: deleteProduct,
                    message: 'Product Deleted Successfully...'
                })
            }
        }
    } catch (error) {
        return ThrowError(response);
    }
};