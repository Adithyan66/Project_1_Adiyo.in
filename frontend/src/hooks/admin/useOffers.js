import { useEffect, useState } from "react";
import { productName } from '../../services/productService'
import { getCategoryList } from '../../services/categoryService'
import { getProductOffers, getCategoryOffers, getReferalOffers } from "../../services/offerServices"

const useOffers = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [productOffers, setProductOffers] = useState([]);
    const [categoryOffers, setCategoryOffers] = useState([]);
    const [referralOffers, setReferralOffers] = useState([]);
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const [productRes, categoryRes, productOfferRes, categoryOfferRes, referralOfferRes] = await Promise.all([
                    productName(),
                    getCategoryList(),
                    getProductOffers(),
                    getCategoryOffers(),
                    getReferalOffers()
                ]);

                if (productRes.data.success) setProducts(productRes.data.products);
                if (categoryRes.data.success) setCategories(categoryRes.data.categories);
                if (productOfferRes.data.success) setProductOffers(productOfferRes.data.offers);
                if (categoryOfferRes.data.success) setCategoryOffers(categoryOfferRes.data.offers);
                if (referralOfferRes.data.success) setReferralOffers(referralOfferRes.data.offers);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false)
            }
        };
        fetchData();
    }, []);

    return {
        products,
        categories,
        productOffers,
        categoryOffers,
        referralOffers,
        setProductOffers,
        setCategoryOffers,
        setReferralOffers,
        loading,
        setLoading
    };
};

export default useOffers