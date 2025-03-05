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
