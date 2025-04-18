import PropTypes from "prop-types"
import { formatDate } from "../../../../hooks/admin/useCouponsForm";

const OfferModal = ({ isOpen, onClose, activeTab, formData, setFormData, selectedProducts, setSelectedProducts, products, categories, onSubmit, currentEditOffer }) => {

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleProductChange = (productId) => {
        setSelectedProducts(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Semi-transparent backdrop */}
            <div className="absolute inset-0 bg-black opacity-50">
            </div>
            <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-medium text-gray-900">{currentEditOffer ? 'Edit Offer' : 'Add New Offer'}</h3>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={onSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Offer Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                    required
                                />
                            </div>
                            {activeTab === 'productOffers' && (
                                <>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                                        <input
                                            type="number"
                                            name="discount"
                                            min="1"
                                            max="100"
                                            value={formData.discount}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Products</label>
                                        <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2">
                                            {products.map((product) => (
                                                <div key={product._id} className="flex items-center mb-2">
                                                    <input
                                                        type="checkbox"
                                                        id={`product-${product._id}`}
                                                        checked={selectedProducts.includes(product._id)}
                                                        onChange={() => handleProductChange(product._id)}
                                                        className="h-4 w-4 text-gray-800 focus:ring-gray-500"
                                                    />
                                                    <label htmlFor={`product-${product._id}`} className="ml-2 text-sm text-gray-700">{product.name}</label>
                                                </div>
                                            ))}
                                        </div>
                                        {selectedProducts.length === 0 && <p className="text-xs text-red-500 mt-1">Please select at least one product</p>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                            <input
                                                type="date"
                                                name="startDate"
                                                value={formatDate(formData.startDate)}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                            <input
                                                type="date"
                                                name="endDate"
                                                value={formatDate(formData.endDate)}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                                required
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                            {activeTab === 'categoryOffers' && (
                                <>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                                        <input
                                            type="number"
                                            name="discount"
                                            min="1"
                                            max="100"
                                            value={formData.discount}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Category</label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                            required
                                        >
                                            <option value="">Select a category</option>
                                            {categories.map((category) => (
                                                <option key={category._id} value={category._id}>{category.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                            <input
                                                type="date"
                                                name="startDate"
                                                value={formatDate(formData.startDate)}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                            <input
                                                type="date"
                                                name="endDate"
                                                value={formatDate(formData.endDate)}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                                required
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                            {activeTab === 'referralOffers' && (
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Reward Amount</label>
                                        <input
                                            type="number"
                                            name="rewardAmount"
                                            min="1"
                                            value={formData.rewardAmount}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Validity (days)</label>
                                        <input
                                            type="number"
                                            name="validity"
                                            min="1"
                                            value={formData.validity}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                            required
                                        />
                                    </div>
                                </div>
                            )}
                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                                    disabled={activeTab === 'productOffers' && selectedProducts.length === 0}
                                >
                                    {currentEditOffer ? 'Update Offer' : 'Create Offer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

OfferModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    activeTab: PropTypes.string.isRequired,
    formData: PropTypes.object.isRequired,
    setFormData: PropTypes.func.isRequired,
    selectedProducts: PropTypes.array.isRequired,
    setSelectedProducts: PropTypes.func.isRequired,
    products: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    onSubmit: PropTypes.func.isRequired,
    currentEditOffer: PropTypes.object
};


export default OfferModal