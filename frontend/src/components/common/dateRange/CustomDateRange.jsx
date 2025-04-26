// import PropTypes from 'prop-types';


// const CustomDateRange = ({ customStartDate, setCustomStartDate, customEndDate, setCustomEndDate, setCurrentPage }) => {
//     return (
//         <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
//             <div>
//                 <label className="block text-sm text-gray-700">Start Date</label>
//                 <input
//                     type="date"
//                     value={customStartDate}
//                     onChange={(e) => {
//                         setCustomStartDate(e.target.value);
//                         setCurrentPage(1);
//                     }}
//                     className="mt-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
//                 />
//             </div>
//             <div>
//                 <label className="block text-sm text-gray-700">End Date</label>
//                 <input
//                     type="date"
//                     value={customEndDate}
//                     onChange={(e) => {
//                         setCustomEndDate(e.target.value);
//                         setCurrentPage(1);
//                     }}
//                     className="mt-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
//                 />
//             </div>
//         </div>
//     );
// };

// CustomDateRange.propTypes = {
//     customStartDate: PropTypes.string.isRequired,
//     setCustomStartDate: PropTypes.func.isRequired,
//     customEndDate: PropTypes.string.isRequired,
//     setCustomEndDate: PropTypes.func.isRequired,
//     setCurrentPage: PropTypes.func.isRequired,
// };


// export default CustomDateRange







import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { parseISO, format, isValid } from 'date-fns';

const CustomDateRange = ({ customStartDate, setCustomStartDate, customEndDate, setCustomEndDate, setCurrentPage }) => {
    // Get today's date
    const today = new Date();

    // Convert string dates to Date objects for DatePicker
    const startDate = customStartDate ? parseISO(customStartDate) : null;
    const endDate = customEndDate ? parseISO(customEndDate) : null;

    // Handle start date change
    const handleStartDateChange = (date) => {
        if (isValid(date)) {
            const formattedDate = format(date, 'yyyy-MM-dd');
            setCustomStartDate(formattedDate);
            setCurrentPage(1);

            // Reset end date if it's before the new start date
            if (endDate && date > endDate) {
                setCustomEndDate('');
            }
        } else {
            setCustomStartDate('');
        }
    };

    // Handle end date change
    const handleEndDateChange = (date) => {
        if (isValid(date)) {
            const formattedDate = format(date, 'yyyy-MM-dd');
            setCustomEndDate(formattedDate);
            setCurrentPage(1);
        } else {
            setCustomEndDate('');
        }
    };

    return (
        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
            <div>
                <label className="block text-sm text-gray-700">Start Date</label>
                <DatePicker
                    selected={startDate}
                    onChange={handleStartDateChange}
                    maxDate={today} // Restrict to today or earlier
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select start date"
                    className="mt-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black w-full"
                    isClearable
                />
            </div>
            <div>
                <label className="block text-sm text-gray-700">End Date</label>
                <DatePicker
                    selected={endDate}
                    onChange={handleEndDateChange}
                    minDate={startDate} // Restrict to start date or later
                    maxDate={today} // Restrict to today or earlier
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select end date"
                    className="mt-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black w-full"
                    disabled={!startDate} // Disable until start date is selected
                    isClearable
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

export default CustomDateRange;