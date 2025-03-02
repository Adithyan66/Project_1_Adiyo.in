


const addProduct = async (req, res) => {

    const { name, price, description, category, quantity, images } = req.body;

    try {
        const product = new Product({
            name,
            price,
            description,
            category,
            quantity,
            images
        });

        await product.save();
        res.json({
            status: true,
            message: 'Product added successfully'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            message: 'Server error'
        });
    }
}


export { addProduct };





