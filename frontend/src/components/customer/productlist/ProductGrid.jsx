// // // src/components/ProductGrid.js
// // import React from "react";

// // function ProductGrid({ products }) {
// //     return (
// //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
// //             {products.map((product) => {
// //                 const finalPrice = product.price * (1 - product.discount / 100);
// //                 return (
// //                     <div
// //                         key={product.id}
// //                         className="bg-white rounded shadow p-4 flex flex-col"
// //                     >
// //                         <img
// //                             src={product.image}
// //                             alt={product.name}
// //                             className="mb-4 w-full h-48 object-cover rounded"
// //                         />
// //                         <h2 className="font-semibold text-lg mb-2">{product.name}</h2>
// //                         <div className="text-sm text-gray-600 mb-2">
// //                             {product.color} • {product.size}
// //                         </div>
// //                         <div className="mt-auto">
// //                             {product.discount > 0 ? (
// //                                 <div className="flex items-center space-x-2">
// //                                     <span className="text-red-500 line-through">
// //                                         ${product.price}
// //                                     </span>
// //                                     <span className="text-green-600 font-bold">
// //                                         ${finalPrice.toFixed(2)}
// //                                     </span>
// //                                 </div>
// //                             ) : (
// //                                 <span className="font-bold">${product.price}</span>
// //                             )}
// //                         </div>
// //                     </div>
// //                 );
// //             })}
// //         </div>
// //     );
// // }

// // export default ProductGrid;






// // src/components/ProductGrid.js
// import React from "react";

// function ProductGrid({ products }) {
//     return (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {products.map((product) => {
//                 const finalPrice = product.price * (1 - product.discount / 100);
//                 return (
//                     <div
//                         key={product.id}
//                         className="bg-white rounded shadow p-4 flex flex-col"
//                     >
//                         <img
//                             src={product.image}
//                             alt={product.name}
//                             className="mb-4 w-full h-48 object-cover rounded"
//                         />
//                         <h2 className="font-semibold text-lg mb-2">{product.name}</h2>
//                         <div className="text-sm text-gray-600 mb-2">
//                             {product.color} • {product.size}
//                         </div>
//                         <div className="mt-auto">
//                             {product.discount > 0 ? (
//                                 <div className="flex items-center space-x-2">
//                                     <span className="text-red-500 line-through">
//                                         ${product.price}
//                                     </span>
//                                     <span className="text-green-600 font-bold">
//                                         ${finalPrice.toFixed(2)}
//                                     </span>
//                                 </div>
//                             ) : (
//                                 <span className="font-bold">${product.price}</span>
//                             )}
//                         </div>
//                     </div>
//                 );
//             })}
//         </div>
//     );
// }

// export default ProductGrid;




// // src/components/ProductGrid.js
// import React from "react";

// function ProductGrid({ products }) {
//     return (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {products.map((product) => {
//                 const finalPrice = product.price * (1 - product.discount / 100);
//                 return (
//                     <div
//                         key={product.id}
//                         className="bg-white rounded shadow p-4 flex flex-col"
//                     >
//                         <img
//                             src={product.image}
//                             alt={product.name}
//                             className="mb-4 w-full h-48 object-cover rounded"
//                         />
//                         <h2 className="font-semibold text-lg mb-2">{product.name}</h2>
//                         <div className="text-sm text-gray-600 mb-2">
//                             {product.color} • {product.size}
//                         </div>
//                         <div className="mt-auto">
//                             {product.discount > 0 ? (
//                                 <div className="flex items-center space-x-2">
//                                     <span className="text-red-500 line-through">
//                                         ${product.price}
//                                     </span>
//                                     <span className="text-green-600 font-bold">
//                                         ${finalPrice.toFixed(2)}
//                                     </span>
//                                 </div>
//                             ) : (
//                                 <span className="font-bold">${product.price}</span>
//                             )}
//                         </div>
//                     </div>
//                 );
//             })}
//         </div>
//     );
// }

// export default ProductGrid;






// src/components/ProductGrid.js
import React from "react";
import ProductCard from "../../common/ProductCard";

function ProductGrid({ products }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((e) => <ProductCard />)}
        </div>
    );
}

export default ProductGrid;






