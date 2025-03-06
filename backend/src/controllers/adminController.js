
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