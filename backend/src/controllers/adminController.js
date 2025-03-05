
import User from "../models/userModel.js";



const customersList = async (req, res) => {

    try {

        const customers = await User.find({ role: "customer" })

        console.log("customers ", customers);


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

export { customersList }