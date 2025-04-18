import PropTypes from "prop-types";


// Component: OfferTabs
export const OfferTabs = ({ activeTab, setActiveTab }) => {
    const tabs = [
        { id: 'productOffers', label: 'Product Offers' },
        { id: 'categoryOffers', label: 'Category Offers' },
        { id: 'referralOffers', label: 'Referral Offers' }
    ];

    return (
        <div className="border-b border-gray-200 mb-6">
            <div className="flex -mb-px">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`py-3 px-4 font-medium text-sm ${activeTab === tab.id ? 'border-b-2 border-gray-800 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

OfferTabs.propTypes = {
    activeTab: PropTypes.string.isRequired,
    setActiveTab: PropTypes.func.isRequired
};

// Component: OfferHeader
export const OfferHeader = ({ title, onAddOffer }) => {
    return (
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            <button
                onClick={onAddOffer}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 flex items-center"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Offer
            </button>
        </div>
    );
};

OfferHeader.propTypes = {
    title: PropTypes.string.isRequired,
    onAddOffer: PropTypes.func.isRequired
};
