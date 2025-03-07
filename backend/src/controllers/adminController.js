
import User from "../models/userModel.js";



export const customersList = async (req, res) => {

    try {

        const customers = await User.find({ role: "customer" })

        res.status(200).json({
            status: true,
            message: "customers details fetched succesfully",
            customers
        })


    } catch (error) {
        res.status(500).json({
            statsu: false,
            message: "server error"
        })
    }
}


export const customerDetails = async (req, res) => {

    try {

        const id = req.params.customerId

        const customer = await User.findById(id)

        res.status(200).json({
            status: true,
            message: "customer details fetched succesfully",
            customer
        })

    } catch (error) {
        res.status(500).json({
            status: false,
            message: "server error"
        })

    }
}



export const blockUser = async (req, res) => {
    const { id } = req.params;
    const { isActive } = req.query;

    // Validate isActive is provided
    if (isActive === undefined) {
        return res.status(400).json({
            status: false,
            message: "Missing required query parameter: isActive",
        });
    }

    // Validate isActive is either "true" or "false" (case-insensitive)
    const lowerIsActive = isActive.toLowerCase();
    if (lowerIsActive !== "true" && lowerIsActive !== "false") {
        return res.status(400).json({
            status: false,
            message: "Invalid value for isActive. Must be 'true' or 'false'.",
        });
    }

    // Convert to boolean
    const newIsActive = lowerIsActive === "true";

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User does not exist",
            });
        }

        // Check if the current status is the same as the new status
        if (user.isActive === newIsActive) {
            return res.status(200).json({
                status: true,
                message: `User is already ${user.isActive ? "unblocked" : "blocked"}`,
            });
        }

        // Update and save the user
        user.isActive = newIsActive;
        await user.save();

        res.status(200).json({
            status: true,
            message: `User ${newIsActive ? "unblocked" : "blocked"} successfully`,
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Server error",
            error: error.message,
        });
    }
};