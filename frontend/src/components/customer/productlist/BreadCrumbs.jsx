import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { breadCrumbCategoryName } from "../../../services/categoryService";

const API_BASE_URL = import.meta.env.VITE_API_URL;



function Breadcrumbs({ product }) {

    const [category, setCategory] = useState("")
    const [subCategory, setSubCategory] = useState("")

    useEffect(() => {

        const fetchCategoryName = async () => {

            //const response = await axios.get(`${API_BASE_URL}/user/category-name/${product.category}/${product.subCategory}`)

            const response = await breadCrumbCategoryName(product.category, product.subCategory)

            setCategory(response.data.category)
            setSubCategory(response.data.subCategory)

        }

        fetchCategoryName()

    }, [])

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
                        {category}
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
                        {subCategory}
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
