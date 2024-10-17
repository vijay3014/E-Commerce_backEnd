import {Request, Response} from 'express';
import { ThrowError } from '../../utils/ErrorUtils';
import * as UserUtils from '../../utils/userUtils';
import { ICategory, ISubCategory } from "../../models/Icategory";
import { CategoryCollection, SubCategoryCollection } from "../../schemas/categorySchema";
import mongoose from 'mongoose';
import { request } from 'http';

/**
 * @usage : Create a new category
 * @url : http://localhost:9000/api/categories
 * @params : name, desc
 * @method : POST,
 * @access : PRIVATE
 */

export const createCategory = async (request:Request, response:Response) => {
    try {
        const { name, desc } = request.body;
        const theUser = await UserUtils.getUser(request, response);
        if(theUser){
            const categoryObj : ICategory | undefined | null = await CategoryCollection.findOne({name: name});
            if(categoryObj){
                return ThrowError(response,401, 'Category is already exists');
            }

            const theCategory : ICategory = {
                name: name,
                desc: desc,
                subCategories: [] as ISubCategory[]
            }
            const saveCategory = await new CategoryCollection(theCategory).save();
            if(saveCategory){
                return response.status(200).json({
                    data: saveCategory,
                    message: 'Category created successfully'
                })
            }
        }
    } catch (error) {
        ThrowError(response);
    }
};


/**
 * @usage : Create a sub category
 * @url : http://localhost:9000/api/categories/:categoryId
 * @params : name, desc
 * @method : POST,
 * @access : PRIVATE
 */
export const createSubCategory =async (request:Request, response: Response) => {
    try {
        const {categoryId} = request.params;
        const mongocateogryId = new mongoose.Types.ObjectId(categoryId);
        const {name, desc} = request.body;
        const theUser = await UserUtils.getUser(request, response);
        if(theUser){
            let theCategory : any = await CategoryCollection.findById(mongocateogryId);
            if(!theCategory) {
                return ThrowError(response, 404,'Category is not exist');
            }
            let theSubcategory : any = await CategoryCollection.findOne({name: name});
            if(!theSubcategory) {
                return ThrowError(response, 401,'Subcategory is already exist');
            }
            let theSub = await new SubCategoryCollection({name: name, desc: desc}).save();
            if(theSub) {
                theCategory.subCategories.push(theSub);
                let categoryObj = await theCategory.save();
                if(categoryObj){
                    return response.status(201).json({
                        data:categoryObj,
                        message: 'sub category is created successfully'
                    })
                }
            }
        }
    } catch (error) {
        return ThrowError(response);
    }
};

/**
 * @usage : Get all categories
 * @url : http://localhost:9000/api/categories/
 * @params : no-params
 * @method : GET
 * @access : public
 */

export const getAllCategories = async (request:Request, response:Response) => {
    try {
        const category = await CategoryCollection.find().populate({
            path: 'subcatories',
            strictPopulate:false
        });
        return response.status(200).json({
            data: category,
            message: 'Categories fetched successfully'
        });
    } catch (error) {
        ThrowError(response);
    }
};