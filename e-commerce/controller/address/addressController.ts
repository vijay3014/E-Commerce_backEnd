import { Request, Response } from 'express';
import { ThrowError } from '../../utils/ErrorUtils';
import * as UserUtils from '../../utils/userUtils';
import AddressCollection from '../../schemas/addressSchema';
import mongoose from 'mongoose';
import { IAddress } from '../../models/Iaddress';

/**
 * @usage : Create New Address
 * @url : http://localhost:9000/api/address/new
 * @param: mobile, flat, landmark, street, city, state, country, pincode
 * @method : POST
 * @access : PRIVATE
 */

export const createAddress = async (request: Request, response: Response) => {
    try {
        const { mobile, flat, landmark, street, city, state, country, pinCode } = request.body;
        const theUser: any = await UserUtils.getUser(request, response);
        if (theUser) {
            const addressObj: any = await AddressCollection.findOne({ userObj: new mongoose.Types.ObjectId(theUser._id) });
            if (addressObj) {
                await AddressCollection.findByIdAndDelete(new mongoose.Types.ObjectId(addressObj._id));
            } else {
                const theAddress: IAddress = {
                    name: theUser.username,
                    email: theUser.email,
                    mobile: mobile,
                    flat: flat,
                    landmark: landmark,
                    street: street,
                    city: city,
                    state: state,
                    country: country,
                    pinCode: pinCode,
                    userObj: theUser._id
                }
                const newAddress = await new AddressCollection(theAddress).save();
                if (newAddress) {
                    return response.status(200).json({
                        status: 'new address added successfully',
                        data: newAddress
                    });
                }
            }
        }
    } catch (error) {
        return ThrowError(response);
    }
};

/**
 * @usage : Update Address
 * @url : http://localhost:9000/api/address/:addressId
 * @parms : mobile, flat, landmark, street, city, state, country, pinCode
 * @method : PUT
 * @access : PRIVATE
 */

export const updateAddress = async (request: Request, response: Response) => {
    try {
        const { addressId } = request.params;
        const mongoAddressId = new mongoose.Types.ObjectId(addressId);
        const { mobile, flat, landmark, street, city, state, country, pinCode } = request.body;
        const theUser: any = await UserUtils.getUser(request, response);
        if (theUser) {
            const theAddress: IAddress | undefined | null = await AddressCollection.findById(mongoAddressId);
            if (theAddress) {
                return ThrowError(response, 404, 'No address found');
            }
            const addressObj: any = await AddressCollection.findByIdAndUpdate(mongoAddressId, {
                $set: {
                    name: theUser.username,
                    email: theUser.email,
                    mobile: mobile,
                    flat: flat,
                    landmark: landmark,
                    street: street,
                    city: city,
                    state: state,
                    country: country,
                    pinCode: pinCode,
                    userObj: theUser._id
                }
            }, 
            { new: true });
            if (addressObj) {
                return response.status(200).json({
                    status: 'address updated successfully',
                    data: addressObj
                });
            }
        }
    } catch (error) {
        return ThrowError(response);
    }
};

/**
 * @usage : GET Address
 * @url : http://localhost:9000/api/address/me
 * @parms : no-param
 * @method : GET
 * @access : PRIVATE
 */

export const getAddress = async (request: Request, response: Response) => {
    try {
        const theUser: any = await UserUtils.getUser(request, response);
        if (theUser) {
            const theAddress: IAddress | undefined | null = await AddressCollection.findOne({userObj : new mongoose.Types.ObjectId(theUser._id)});
            if (!theAddress) {
                return ThrowError(response, 404, 'Address not found')
            }
            return response.status(200).json({
                status: 'address found successfully',
                data: theAddress
            });
        }
    } catch (error) {
        return ThrowError(response);
    }
};

/**
 * @usage : Delete Address
 * @url : http://localhost:9000/api/address/:addressId
 * @parms : addressId
 * @method : Delete
 * @access : PRIVATE
 */

export const deleteAddress = async (request: Request, response: Response) => {
    try {
        const { addressId } = request.params;
        const mongoAddressId = new mongoose.Types.ObjectId(addressId);
        const theUser: any = await UserUtils.getUser(request, response);
        if (theUser) {
            const theAddress: IAddress | undefined | null = await AddressCollection.findById(mongoAddressId);
            if (theAddress) {
                return ThrowError(response, 404, 'No address found');
            }
            const addressObj: any = await AddressCollection.findByIdAndDelete(mongoAddressId);
            if (addressObj) {
                return response.status(200).json({
                    status: 'address deleted successfully',
                    data: addressObj
                });
            }
        }
    } catch (error) {
        return ThrowError(response);
    }
};