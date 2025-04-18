import PropTypes from "prop-types"

const EmptyState = ({ type, onAddOffer }) => {
    return (
        <div className="text-center py-10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 12H4M12 4v16" />
            </svg>
            <h3 className="mt-2 text-base font-medium text-gray-900">No offers found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new {type} offer.</p>
            <div className="mt-6">
                <button
                    onClick={onAddOffer}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 inline-flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add New Offer
                </button>
            </div>
        </div>
    );
};

EmptyState.propTypes = {
    type: PropTypes.string.isRequired,
    onAddOffer: PropTypes.func.isRequired
};

export default EmptyState