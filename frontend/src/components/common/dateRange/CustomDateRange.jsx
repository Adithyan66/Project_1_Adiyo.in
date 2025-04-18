import PropTypes from 'prop-types';


const CustomDateRange = ({ customStartDate, setCustomStartDate, customEndDate, setCustomEndDate, setCurrentPage }) => {
    return (
        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
            <div>
                <label className="block text-sm text-gray-700">Start Date</label>
                <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => {
                        setCustomStartDate(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="mt-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                />
            </div>
            <div>
                <label className="block text-sm text-gray-700">End Date</label>
                <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => {
                        setCustomEndDate(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="mt-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                />
            </div>
        </div>
    );
};

CustomDateRange.propTypes = {
    customStartDate: PropTypes.string.isRequired,
    setCustomStartDate: PropTypes.func.isRequired,
    customEndDate: PropTypes.string.isRequired,
    setCustomEndDate: PropTypes.func.isRequired,
    setCurrentPage: PropTypes.func.isRequired,
};


export default CustomDateRange