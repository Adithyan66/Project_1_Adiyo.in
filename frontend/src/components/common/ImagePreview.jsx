import React, { useState, useEffect } from "react";

function ImagePreview({ file }) {
    const [previewUrl, setPreviewUrl] = useState("");

    useEffect(() => {
        let url = "";
        if (file instanceof File) {
            url = URL.createObjectURL(file);
            setPreviewUrl(url);
        } else {
            // Assume file is a URL (string)
            setPreviewUrl(file);
        }
        return () => {
            if (url) URL.revokeObjectURL(url);
        };
    }, [file]);

    return (
        <img
            src={previewUrl}
            alt="Preview"
            className="object-cover w-full h-full rounded"
        />
    );
}

export default ImagePreview;
