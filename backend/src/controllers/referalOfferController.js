import HttpStatusCode from "../utils/httpStatusCodes.js";
const {
    OK,
    CREATED,
    ACCEPTED,
    NO_CONTENT,
    BAD_REQUEST,
    UNAUTHORIZED,
    FORBIDDEN,
    NOT_FOUND,
    METHOD_NOT_ALLOWED,
    CONFLICT,
    UNPROCESSABLE_ENTITY,
    INTERNAL_SERVER_ERROR,
    BAD_GATEWAY,
    SERVICE_UNAVAILABLE,
    GATEWAY_TIMEOUT
} = HttpStatusCode

import ReferralOffer from "../models/referalOfferModel.js";



export const createReferalOffer = async (req, res) => {

    try {

        const { name, rewardAmount, validity } = req.body;

        const newOffer = new ReferralOffer({
            name,
            rewardAmount,
            validity
        });

        const savedOffer = await newOffer.save();

        res.status(CREATED).json({
            success: true,
            data: savedOffer
        });

    } catch (error) {

        console.error('Error creating referral offer:', error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Server error while creating offer.'
        });
    }
}



export const getReferalOffers = async (req, res) => {

    try {

        const offers = await ReferralOffer.find({ deletedAt: null });

        res.status(OK).json({ success: true, offers });

    } catch (error) {

        console.error("Error fetching referral offers:", error);
        res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: "Server error while fetching offers." });
    }
}


export const editReferalOffer = async (req, res) => {

    try {

        const offerId = req.params.id;

        const { name, rewardAmount, rewardType, method, minPurchase, validity } = req.body;

        const updatedOffer = await ReferralOffer.findByIdAndUpdate(
            offerId,
            { name, rewardAmount, rewardType, method, minPurchase, validity },
            { new: true, runValidators: true }
        );

        if (!updatedOffer) {
            return res.status(NOT_FOUND).json({ success: false, message: 'Referral offer not found.' });
        }

        res.status(OK).json({ success: true, data: updatedOffer });

    } catch (error) {

        console.error('Error updating referral offer:', error);
        res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Server error while updating offer.' });
    }
}

export const toggleReferalStatus = async (req, res) => {

    try {

        const { id } = req.params

        const { status } = req.body

        if (status) {

            const offers = await ReferralOffer.updateMany({}, { isActive: false })
            console.log(offers);
        }

        const update = await ReferralOffer.findByIdAndUpdate(id, { isActive: status }, { new: true })

        if (!update) {
            return res.status(404).json({
                success: false,
                message: "offer not found"
            })
        }

        res.status(OK).json({
            success: true,
            message: "status updated successfully",
            offer: update
        })

    } catch (error) {

        console.error('Error updating referral offer status:', error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Server error while updating offer status.'
        });
    }
}

export const deleteReferealOffer = async (req, res) => {

    try {

        const { id } = req.params

        const offer = await ReferralOffer.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true })

        if (!offer) {
            return res.status(404).json({
                success: false,
                message: "failed to delete offer"
            })
        }

        res.status(OK).json({
            success: true,
            message: "offer deleted succesfully"
        })

    } catch (error) {

        console.log("error in deleting referral offer", error)
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "server error"
        })
    }
}
