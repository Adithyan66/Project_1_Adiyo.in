import ReactCrop from "react-image-crop";
import { CloseIcon } from "../../../icons/icons";

export const CropModal = ({
    cropMode,
    imgSrc,
    crop,
    setCrop,
    completedCrop,
    setCompletedCrop,
    onImageLoad,
    handleSaveCrop,
    handleCancelCrop,
}) => {
    if (!cropMode || !imgSrc) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Semi-transparent backdrop */}
            <div className="absolute inset-0 bg-black opacity-50"></div>
            {/* Modal container */}
            <div className="relative bg-white rounded-lg max-w-[620px] w-full p-4 shadow z-10">
                {/* Close icon button */}
                <button
                    onClick={handleCancelCrop}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                    <CloseIcon />
                </button>
                <h3 className="text-xl font-bold mb-4">Crop Image</h3>
                <p className="text-sm text-gray-500 mb-4">
                    Drag to position. The crop maintains a 4:5 aspect ratio.
                </p>
                <div className="mb-4 flex justify-center">
                    <div className="max-w-[400px]">
                        <ReactCrop
                            crop={crop}
                            onChange={(c) => setCrop(c)}
                            onComplete={(c) => setCompletedCrop(c)}
                            aspect={4 / 5}
                            circularCrop={false}
                        >
                            <img
                                src={imgSrc}
                                onLoad={onImageLoad}
                                alt="Crop Preview"
                                className="w-full object-contain"
                            />
                        </ReactCrop>
                    </div>
                </div>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={handleCancelCrop}
                        className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSaveCrop}
                        className="px-4 py-2 bg-black text-white rounded hover:bg-gray-700"
                        disabled={!completedCrop?.width || !completedCrop?.height}
                    >
                        Save Crop
                    </button>
                </div>
            </div>
        </div>
    );
};