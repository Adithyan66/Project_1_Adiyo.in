import PropTypes from 'prop-types';
import downloadPDF from '../../../utils/forSalesReport/downloadPDF'
import downloadExcel from "../../../utils/forSalesReport/downloadExcel"

const DownloadButtons = ({ downloadParams, hasData }) => {
    if (!hasData) return null;
    return (
        <div className="flex space-x-2 mt-4">
            <button
                onClick={() => downloadExcel(downloadParams)}
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-700 flex items-center"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-9.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Excel
            </button>
            <button
                onClick={() => downloadPDF(downloadParams)}
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-9.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                PDF
            </button>
        </div>
    );
};

DownloadButtons.propTypes = {
    downloadParams: PropTypes.object.isRequired,
    hasData: PropTypes.bool.isRequired,
};


export default DownloadButtons