
import PropTypes from 'prop-types';

const SummaryCards = ({ summary }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded shadow p-4">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Total Sales</h3>
                <p className="text-2xl font-bold">₹{summary.totalSales.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-white rounded shadow p-4">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Total Orders</h3>
                <p className="text-2xl font-bold">{summary.totalOrders}</p>
            </div>
            <div className="bg-white rounded shadow p-4">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Overall Discounts</h3>
                <p className="text-2xl font-bold">₹{summary.overallDiscount.toLocaleString('en-IN')}</p>
            </div>
        </div>
    );
};

SummaryCards.propTypes = {
    summary: PropTypes.shape({
        totalSales: PropTypes.number.isRequired,
        totalOrders: PropTypes.number.isRequired,
        overallDiscount: PropTypes.number.isRequired,
    }).isRequired,
};


export default SummaryCards