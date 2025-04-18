



// import React from "react";
// import { useNavigate } from "react-router-dom";

// import ProductCard from "../../common/ProductCard";




// function ProductGrid({ products }) {


//     const navigate = useNavigate()

//     return (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//             {products.map((product) => <ProductCard product={product} />)}
//         </div>
//     );
// }

// export default ProductGrid;






import React from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../common/ProductCard";

function ProductGrid({ products }) {
    const navigate = useNavigate();

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            {products.map((product) => (
                <ProductCard key={product._id} product={product} />
            ))}
        </div>
    );
}

export default ProductGrid;