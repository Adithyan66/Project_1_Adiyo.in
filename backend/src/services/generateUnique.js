import User from "../models/userModel.js";



export async function generateUniqueUserId(role) {

    let prefix, baseNumber;

    if (role === 'customer') {
        prefix = "Adyocus";
        baseNumber = 1000;
    } else if (role === 'seller') {
        prefix = "Adyosel";
        baseNumber = 1000;
    } else {
        throw new Error('Unsupported role for generating customer ID.');
    }

    let isUnique = false;
    let counter = 0;
    let candidateId = "";

    while (!isUnique) {
        candidateId = `${prefix}${baseNumber + counter}`;
        const existingUser = await User.findOne({ userId: candidateId });
        if (!existingUser) {
            isUnique = true;
        } else {
            counter++;
        }
    }

    return candidateId;
}


export const generateUniqueReferralCode = async () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let referralCode;
    let isUnique = false;

    while (!isUnique) {
        referralCode = '';
        for (let i = 0; i < 10; i++) {
            referralCode += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        // Check if this code already exists
        const existingCode = await UserReferral.findOne({ referralCode });
        if (!existingCode) {
            isUnique = true;
        }
    }

    return referralCode;
};
