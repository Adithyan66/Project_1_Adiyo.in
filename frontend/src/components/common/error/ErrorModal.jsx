
const ErrorModal = ({ isOpen, message, onClose }) => {

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-2">
                <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
                <p className="text-gray-700 mb-6">{message}</p>
                <div className="text-right">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorModal;
