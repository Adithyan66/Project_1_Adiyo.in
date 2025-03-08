import { Link } from "react-router-dom";

function Breadcrumbs({ product }) {
    return (
        <nav className="text-sm mb-4" aria-label="Breadcrumb">
            <ol className="list-reset flex text-gray-600">
                <li>
                    <Link to="/" className="text-black hover:underline">
                        Home
                    </Link>
                </li>
                <li>
                    <span className="mx-2">/</span>
                </li>
                <li>
                    {/* Pass category as a query parameter */}
                    <Link
                        to={`/products-list?category=${encodeURIComponent(product.category)}`}
                        className="text-black hover:underline"
                    >
                        {product.category}
                    </Link>
                </li>
                <li>
                    <span className="mx-2">/</span>
                </li>
                <li>
                    {/* You can also pass subCategory */}
                    <Link
                        to={`/products-list?subCategory=${encodeURIComponent(product.subCategory)}`}
                        className="text-black hover:underline"                    >
                        {product.subCategory}
                    </Link>
                </li>
                <li>
                    <span className="mx-2">/</span>
                </li>
                <li className="text-gray-500">{product.name}</li>
            </ol>
        </nav>
    );
}

export default Breadcrumbs;
