import ImagePreview from "../ImagePreview";

export const ImageUpload = ({
    img,
    colIndex,
    imgIndex,
    handleColorImageSelect,
    colorName,
}) => (
    <div
        className="relative flex flex-col items-center justify-center w-80 h-80 border-2 border-dashed border-gray-300 rounded cursor-pointer"
    >
        {img && !(img instanceof File) ? (
            <img
                src={img}
                alt={`Color ${colIndex} - ${imgIndex}`}
                className="object-cover w-full h-full rounded"
            />
        ) : img instanceof File ? (
            <ImagePreview file={img} />
        ) : (
            <span className="text-gray-400 text-sm">Add Image</span>
        )}
        <input
            type="file"
            className="opacity-0 absolute w-80 h-80"
            accept="image/*"
            onChange={(e) => {
                if (e.target.files[0]) {
                    handleColorImageSelect(colIndex, imgIndex, e.target.files[0], e);
                }
            }}
        />
    </div>
);