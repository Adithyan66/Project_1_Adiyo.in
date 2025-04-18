
import { useState } from "react";
import useOffers from "../../../../hooks/admin/useOffers";
import { createCategoryOffer, createProductOffer, createReferalOffer, deleteOffer, editCategoryOffer, editProductOffer, editReferalOffer, getCategoryOffers, getProductOffers, getReferalOffers, toggleStatusOfOffers } from "../../../../services/offerServices";
import { OfferHeader, OfferTabs } from "./TabAndHeader";
import OfferModal from "./OfferModal";
import DataTable from "../../../common/adminTable/DataTable"
import EmptyState from "./EmptyState";
import { renderProductNames } from "../../../../utils/forOffer/renderProductName";
import { PulseRingLoader } from "../../../common/loading/Spinner";


const ManageOffers = () => {


    const [activeTab, setActiveTab] = useState('productOffers');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [currentEditOffer, setCurrentEditOffer] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        discount: '',
        products: [],
        category: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        rewardAmount: '',
        validity: ''
    });

    const { products, categories, productOffers, categoryOffers, referralOffers, setProductOffers, setCategoryOffers, setReferralOffers, loading, setLoading } = useOffers();

    const handleAddOffer = () => {
        setCurrentEditOffer(null);
        setFormData({
            name: '',
            discount: '',
            products: [],
            category: '',
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0],
            rewardAmount: '',
            validity: ''
        });
        setSelectedProducts([]);
        setIsAddModalOpen(true);
    };

    const handleEditOffer = (offer) => {
        setCurrentEditOffer(offer);
        if (activeTab === 'productOffers') {
            setFormData({
                name: offer.name,
                discount: offer.discount,
                startDate: offer.startDate,
                endDate: offer.endDate
            });
            setSelectedProducts(offer.products.map(p => typeof p === 'object' ? p._id : p));
        } else if (activeTab === 'categoryOffers') {
            setFormData({
                name: offer.name,
                discount: offer.discount,
                category: offer.category._id,
                startDate: offer.startDate,
                endDate: offer.endDate
            });
        } else if (activeTab === 'referralOffers') {
            setFormData({
                name: offer.name,
                rewardAmount: offer.rewardAmount,
                validity: offer.validity
            });
        }
        setIsAddModalOpen(true);
    };

    const handleSubmitOffer = async (e) => {
        e.preventDefault();
        try {
            setLoading(true)
            if (activeTab === 'productOffers') {
                const payload = {
                    name: formData.name,
                    discount: Number(formData.discount),
                    products: selectedProducts,
                    startDate: formData.startDate,
                    endDate: formData.endDate
                };
                if (new Date(formData.startDate) > new Date(formData.endDate)) {
                    toast.error("Starting Date should be before Ending Date");
                    return;
                }
                const response = currentEditOffer ? await editProductOffer(currentEditOffer._id, payload) : await createProductOffer(payload);
                if (response.data.success) {
                    const updatedOffers = await getProductOffers();
                    setProductOffers(updatedOffers.data.offers);
                }
            } else if (activeTab === 'categoryOffers') {
                const payload = {
                    name: formData.name,
                    discount: Number(formData.discount),
                    category: formData.category,
                    startDate: formData.startDate,
                    endDate: formData.endDate
                };
                if (new Date(formData.startDate) > new Date(formData.endDate)) {
                    toast.error("Starting Date should be before Ending Date");
                    return;
                }
                const response = currentEditOffer ? await editCategoryOffer(currentEditOffer._id, payload) : await createCategoryOffer(payload);
                if (response.data.success) {
                    const updatedOffers = await getCategoryOffers();
                    setCategoryOffers(updatedOffers.data.offers);
                }
            } else if (activeTab === 'referralOffers') {
                const payload = {
                    name: formData.name,
                    rewardAmount: Number(formData.rewardAmount),
                    validity: Number(formData.validity)
                };
                const response = currentEditOffer ? await editReferalOffer(currentEditOffer._id, payload) : await createReferalOffer(payload);
                if (response.data.success) {
                    const updatedOffers = await getReferalOffers();
                    setReferralOffers(updatedOffers.data.offers);
                }
            }
            setIsAddModalOpen(false);
            setFormData({
                name: '',
                discount: '',
                products: [],
                category: '',
                startDate: new Date().toISOString().split('T')[0],
                endDate: new Date().toISOString().split('T')[0],
                rewardAmount: '',
                validity: ''
            });
            setSelectedProducts([]);
        } catch (error) {
            console.error('Error submitting offer:', error);
        } finally {
            setLoading(false)
        }
    };

    const handleDeleteOffer = async (id) => {
        try {
            setLoading(true)
            const type = activeTab === 'productOffers' ? 'product-offer' : activeTab === 'categoryOffers' ? 'category-offer' : 'referral-offer';
            const response = await deleteOffer(type, id);
            if (response.data.success) {
                if (activeTab === 'productOffers') {
                    const updatedOffers = await getProductOffers();
                    setProductOffers(updatedOffers.data.offers);
                } else if (activeTab === 'categoryOffers') {
                    const updatedOffers = await getCategoryOffers();
                    setCategoryOffers(updatedOffers.data.offers);
                } else {
                    const updatedOffers = await getReferalOffers();
                    setReferralOffers(updatedOffers.data.offers);
                }
            }
        } catch (error) {
            console.error('Error deleting offer:', error);
        } finally {
            setLoading(false)
        }
    };

    const toggleOfferStatus = async (id) => {
        try {
            const offer = activeTab === 'productOffers' ? productOffers.find(o => o._id === id) : activeTab === 'categoryOffers' ? categoryOffers.find(o => o._id === id) : referralOffers.find(o => o._id === id);
            const currentStatus = activeTab === 'referralOffers' ? offer.isActive : offer.status;
            const type = activeTab === 'productOffers' ? 'product-offer' : activeTab === 'categoryOffers' ? 'category-offer' : 'referral-offer';
            const response = await toggleStatusOfOffers(type, id, currentStatus);
            if (response.data.success) {
                if (activeTab === 'productOffers') {
                    const updatedOffers = await getProductOffers();
                    setProductOffers(updatedOffers.data.offers);
                } else if (activeTab === 'categoryOffers') {
                    const updatedOffers = await getCategoryOffers();
                    setCategoryOffers(updatedOffers.data.offers);
                } else {
                    const updatedOffers = await getReferalOffers();
                    setReferralOffers(updatedOffers.data.offers);
                }
            }
        } catch (error) {
            console.error('Error toggling offer status:', error);
        }
    };

    const getColumns = () => {
        if (activeTab === 'productOffers') {
            return [
                { header: 'Offer Name', field: 'name', sortable: false },
                { header: 'Discount', field: 'discount', sortable: false, render: item => `${item.discount}%` },
                { header: 'Products', field: 'products', sortable: false, render: item => renderProductNames(item.products, products) },
                { header: 'Validity', field: 'validity', sortable: false, render: item => `${new Date(item.startDate).toLocaleDateString()} to ${new Date(item.endDate).toLocaleDateString()}` },
                {
                    header: 'Status', field: 'status', sortable: false, render: item => (
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {item.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                    )
                },
            ];
        } else if (activeTab === 'categoryOffers') {
            return [
                { header: 'Offer Name', field: 'name', sortable: false },
                { header: 'Discount', field: 'discount', sortable: false, render: item => `${item.discount}%` },
                { header: 'Category', field: 'category', sortable: false, render: item => renderProductNames(item.category, categories) },
                { header: 'Validity', field: 'validity', sortable: false, render: item => `${new Date(item.startDate).toLocaleDateString()} to ${new Date(item.endDate).toLocaleDateString()}` },
                {
                    header: 'Status', field: 'status', sortable: false, render: item => (
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {item.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                    )
                },
            ];
        } else {
            return [
                { header: 'Offer Name', field: 'name', sortable: false },
                { header: 'Reward', field: 'rewardAmount', sortable: false },
                { header: 'Validity (days)', field: 'validity', sortable: false },
                {
                    header: 'Status', field: 'isActive', sortable: false, render: item => (
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {item.isActive ? 'Active' : 'Inactive'}
                        </span>
                    )
                },
            ];
        }
    };

    const getActions = () => {
        if (activeTab === 'referralOffers') {
            return [
                {
                    label: 'Toggle',
                    className: 'px-2 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200',
                    handler: item => toggleOfferStatus(item._id),
                    render: (item) => (
                        <button
                            onClick={() => toggleOfferStatus(item._id)}
                            className={`px-2 py-1 rounded ${item.isActive ? 'bg-gray-200 text-gray-800' : 'bg-green-100 text-green-800'} hover:bg-opacity-80`}
                        >
                            {item.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                    )
                },
                {
                    label: 'Edit',
                    className: 'px-2 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200',
                    handler: handleEditOffer
                },
                {
                    label: 'Delete',
                    className: 'px-2 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200',
                    handler: item => handleDeleteOffer(item._id)
                }
            ];
        }
        return [
            {
                label: 'Edit',
                className: 'px-2 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200',
                handler: handleEditOffer
            },
            {
                label: 'Delete',
                className: 'px-2 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200',
                handler: item => handleDeleteOffer(item._id)
            }
        ];
    };

    const getData = () => {
        if (activeTab === 'productOffers') return productOffers;
        if (activeTab === 'categoryOffers') return categoryOffers;
        return referralOffers;
    };

    const getTitle = () => {
        if (activeTab === 'productOffers') return 'Product Offers';
        if (activeTab === 'categoryOffers') return 'Category Offers';
        return 'Referral Offers';
    };

    const getEmptyStateType = () => {
        if (activeTab === 'productOffers') return 'product';
        if (activeTab === 'categoryOffers') return 'category';
        return 'referral';
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 w-full">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Manage Offers</h1>
                <p className="text-gray-500 mt-1">Create and manage special offers, discounts, and referral programs</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg mb-6 border-l-4 border-gray-800">
                <h3 className="font-medium text-gray-800">Offer Priority Rules</h3>
                <p className="text-sm text-gray-600 mt-1">When multiple offers apply to a product (e.g., 20% product offer and 30% category offer), only the greater discount will be applied.</p>
            </div>
            {loading ? <PulseRingLoader /> : (
                <>
                    <OfferTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                    <OfferHeader title={getTitle()} onAddOffer={handleAddOffer} />
                    {getData().length === 0 ? (
                        <EmptyState type={getEmptyStateType()} onAddOffer={handleAddOffer} />
                    ) : (
                        <DataTable
                            columns={getColumns()}
                            data={getData()}
                            actions={getActions()}
                        />
                    )}
                    <OfferModal
                        isOpen={isAddModalOpen}
                        onClose={() => setIsAddModalOpen(false)}
                        activeTab={activeTab}
                        formData={formData}
                        setFormData={setFormData}
                        selectedProducts={selectedProducts}
                        setSelectedProducts={setSelectedProducts}
                        products={products}
                        categories={categories}
                        onSubmit={handleSubmitOffer}
                        currentEditOffer={currentEditOffer}
                    />
                </>
            )}
        </div>
    );
};

export default ManageOffers