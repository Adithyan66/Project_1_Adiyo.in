
// import HttpStatusCode from "../utils/httpStatusCodes.js";
// import Address from "../models/addressModel.js";
// import messages from "../utils/messages.js"
// const {
//     OK,
//     BAD_REQUEST,
//     UNAUTHORIZED,
//     NOT_FOUND,
//     INTERNAL_SERVER_ERROR,
// } = HttpStatusCode



// export const saveAddress = async (req, res) => {

//     const userId = req.user.userId

//     try {

//         if (!userId) {
//             return res.status(UNAUTHORIZED).json({
//                 success: false,
//                 message: messages.AUTH.USER_NOT_AUTHENTICATED
//             });
//         }

//         const addressCount = await Address.countDocuments({ userId })

//         const isDefault = addressCount === 0 ? true : req.body.formData.isDefault || false

//         if (isDefault) {
//             await Address.updateMany(
//                 { userId, isDefault: true },
//                 { $set: { isDefault: false } }
//             )
//         }

//         const newAddress = new Address({
//             userId,
//             fullName: req.body.formData.fullName,
//             phoneNumber: req.body.formData.phoneNumber,
//             alternatePhone: req.body.formData.alternatePhone || '',
//             address: req.body.formData.address,
//             locality: req.body.formData.locality,
//             city: req.body.formData.city,
//             state: req.body.formData.state,
//             pincode: req.body.formData.pincode,
//             landmark: req.body.formData.landmark || '',
//             addressType: req.body.formData.addressType || 'Home',
//             isDefault,
//             isActive: true
//         });

//         const saveAddress = await newAddress.save()

//         res.status(OK).json({
//             success: true,
//             message: "Address saved succesfully",
//             address: saveAddress
//         })

//     } catch (error) {

//         console.log(error);
//         res.status(BAD_REQUEST).json({
//             success: false,
//             message: error.message || 'Failed to save address'

//         })
//     }
// }


// export const getUserAddresses = async (req, res) => {

//     const userId = req.user.userId

//     try {

//         if (!userId) {
//             return res.status(UNAUTHORIZED).json({
//                 success: false,
//                 message: 'User not authenticated'
//             });
//         }

//         const addresses = await Address.find({
//             userId,
//             isActive: true
//         }).sort({ isDefault: - 1, createdAt: - 1 })


//         res.status(OK).json({
//             success: true,
//             message: "address fetched succesfully",
//             addresses
//         });


//     } catch (error) {
//         res.status(INTERNAL_SERVER_ERROR).json({
//             success: false,
//             message: 'Failed to fetch addresses',
//         })
//     }
// }



// export const editAddress = async (req, res) => {

//     const userId = req.user.userId;
//     const { formData } = req.body;
//     const { addressId } = req.body.formData;

//     try {
//         if (!userId) {
//             return res.status(UNAUTHORIZED).json({
//                 success: false,
//                 message: 'User not authenticated'
//             });
//         }

//         const existingAddress = await Address.findOne({ _id: addressId, userId });

//         if (!existingAddress) {
//             return res.status(NOT_FOUND).json({
//                 success: false,
//                 message: 'Address not found'
//             });
//         }

//         if (formData.isDefault) {
//             await Address.updateMany(
//                 { userId, isDefault: true },
//                 { $set: { isDefault: false } }
//             );
//         }

//         const updatedAddress = await Address.findByIdAndUpdate(
//             addressId,
//             {
//                 fullName: formData.fullName,
//                 phoneNumber: formData.phoneNumber,
//                 alternatePhone: formData.alternatePhone || '',
//                 address: formData.address,
//                 locality: formData.locality,
//                 city: formData.city,
//                 state: formData.state,
//                 pincode: formData.pincode,
//                 landmark: formData.landmark || '',
//                 addressType: formData.addressType || 'Home',
//                 isDefault: formData.isDefault || false
//             },
//             { new: true }
//         );

//         res.status(OK).json({
//             success: true,
//             message: 'Address updated successfully',
//             address: updatedAddress
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(BAD_REQUEST).json({
//             success: false,
//             message: error.message || 'Failed to update address'
//         });
//     }
// };


// export const deleteAddress = async (req, res) => {

//     const userId = req.user.userId;
//     const addressId = req.params.id;

//     try {

//         const address = await Address.findOne({ _id: addressId, userId });

//         if (!address) {
//             return res.status(NOT_FOUND).json({
//                 success: false,
//                 message: 'Address not found'
//             });
//         }


//         await Address.findByIdAndDelete(addressId);

//         res.status(OK).json({
//             success: true,
//             message: 'Address deleted successfully'
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(INTERNAL_SERVER_ERROR).json({
//             success: false,
//             message: 'Failed to delete address'
//         });
//     }
// };



// export const makeDefaultAddress = async (req, res) => {

//     const userId = req.user.userId;
//     const { addressId } = req.params;

//     try {
//         if (!userId) {
//             return res.status(401).json({
//                 success: false,
//                 message: 'User not authenticated'
//             });
//         }

//         await Address.updateMany(
//             { userId, isDefault: true },
//             { $set: { isDefault: false } }
//         );

//         const updatedAddress = await Address.findByIdAndUpdate(
//             addressId,
//             { isDefault: true },
//             { new: true }
//         );

//         if (!updatedAddress) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Address not found'
//             });
//         }

//         res.status(200).json({
//             success: true,
//             message: 'Address set as default successfully',
//             address: updatedAddress
//         });

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             success: false,
//             message: 'Server error'
//         });
//     }
// };








import HttpStatusCode from "../utils/httpStatusCodes.js";
import Address from "../models/addressModel.js";
import messages from "../utils/messages.js";

const {
    OK,
    BAD_REQUEST,
    UNAUTHORIZED,
    NOT_FOUND,
    INTERNAL_SERVER_ERROR,
} = HttpStatusCode;

export const saveAddress = async (req, res) => {
    const userId = req.user.userId;

    try {
        if (!userId) {
            return res.status(UNAUTHORIZED).json({
                success: false,
                message: messages.AUTH.USER_NOT_AUTHENTICATED,
            });
        }

        const addressCount = await Address.countDocuments({ userId });

        const isDefault = addressCount === 0 ? true : req.body.formData.isDefault || false;

        if (isDefault) {
            await Address.updateMany(
                { userId, isDefault: true },
                { $set: { isDefault: false } }
            );
        }

        const newAddress = new Address({
            userId,
            fullName: req.body.formData.fullName,
            phoneNumber: req.body.formData.phoneNumber,
            alternatePhone: req.body.formData.alternatePhone || '',
            address: req.body.formData.address,
            locality: req.body.formData.locality,
            city: req.body.formData.city,
            state: req.body.formData.state,
            pincode: req.body.formData.pincode,
            landmark: req.body.formData.landmark || '',
            addressType: req.body.formData.addressType || 'Home',
            isDefault,
            isActive: true,
        });

        const saveAddress = await newAddress.save();

        res.status(OK).json({
            success: true,
            message: messages.ADDRESS.SAVED_SUCCESSFULLY,
            address: saveAddress,
        });
    } catch (error) {
        console.log(error);
        res.status(BAD_REQUEST).json({
            success: false,
            message: error.message || messages.ADDRESS.FAILED_SAVE,
        });
    }
};

export const getUserAddresses = async (req, res) => {
    const userId = req.user.userId;

    try {
        if (!userId) {
            return res.status(UNAUTHORIZED).json({
                success: false,
                message: messages.AUTH.USER_NOT_AUTHENTICATED,
            });
        }

        const addresses = await Address.find({
            userId,
            isActive: true,
        }).sort({ isDefault: -1, createdAt: -1 });

        res.status(OK).json({
            success: true,
            message: messages.ADDRESS.FETCHED_SUCCESSFULLY,
            addresses,
        });
    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: messages.ADDRESS.FAILED_FETCH,
        });
    }
};

export const editAddress = async (req, res) => {
    const userId = req.user.userId;
    const { formData } = req.body;
    const { addressId } = req.body.formData;

    try {
        if (!userId) {
            return res.status(UNAUTHORIZED).json({
                success: false,
                message: messages.AUTH.USER_NOT_AUTHENTICATED,
            });
        }

        const existingAddress = await Address.findOne({ _id: addressId, userId });

        if (!existingAddress) {
            return res.status(NOT_FOUND).json({
                success: false,
                message: messages.ADDRESS.NOT_FOUND,
            });
        }

        if (formData.isDefault) {
            await Address.updateMany(
                { userId, isDefault: true },
                { $set: { isDefault: false } }
            );
        }

        const updatedAddress = await Address.findByIdAndUpdate(
            addressId,
            {
                fullName: formData.fullName,
                phoneNumber: formData.phoneNumber,
                alternatePhone: formData.alternatePhone || '',
                address: formData.address,
                locality: formData.locality,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode,
                landmark: formData.landmark || '',
                addressType: formData.addressType || 'Home',
                isDefault: formData.isDefault || false,
            },
            { new: true }
        );

        res.status(OK).json({
            success: true,
            message: messages.ADDRESS.UPDATED_SUCCESSFULLY,
            address: updatedAddress,
        });
    } catch (error) {
        console.error(error);
        res.status(BAD_REQUEST).json({
            success: false,
            message: error.message || messages.ADDRESS.FAILED_UPDATE,
        });
    }
};

export const deleteAddress = async (req, res) => {
    const userId = req.user.userId;
    const addressId = req.params.id;

    try {
        const address = await Address.findOne({ _id: addressId, userId });

        if (!address) {
            return res.status(NOT_FOUND).json({
                success: false,
                message: messages.ADDRESS.NOT_FOUND,
            });
        }

        await Address.findByIdAndDelete(addressId);

        res.status(OK).json({
            success: true,
            message: messages.ADDRESS.DELETED_SUCCESSFULLY,
        });
    } catch (error) {
        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: messages.ADDRESS.FAILED_DELETE,
        });
    }
};

export const makeDefaultAddress = async (req, res) => {
    const userId = req.user.userId;
    const { addressId } = req.params;

    try {
        if (!userId) {
            return res.status(UNAUTHORIZED).json({
                success: false,
                message: messages.AUTH.USER_NOT_AUTHENTICATED,
            });
        }

        await Address.updateMany(
            { userId, isDefault: true },
            { $set: { isDefault: false } }
        );

        const updatedAddress = await Address.findByIdAndUpdate(
            addressId,
            { isDefault: true },
            { new: true }
        );

        if (!updatedAddress) {
            return res.status(NOT_FOUND).json({
                success: false,
                message: messages.ADDRESS.NOT_FOUND,
            });
        }

        res.status(OK).json({
            success: true,
            message: messages.ADDRESS.DEFAULT_SET_SUCCESSFULLY,
            address: updatedAddress,
        });
    } catch (error) {
        console.log(error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: messages.SERVER.ERROR,
        });
    }
};