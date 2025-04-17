
export const ProductDetailsForm = ({
    sku,
    productName,
    setProductName,
    shortDescription,
    setShortDescription,
    productDescription,
    setProductDescription,
    brand,
    setBrand,
    category,
    setCategory,
    subCategory,
    setSubCategory,
    material,
    setMaterial,
    careInstructions,
    setCareInstructions,
    totalQuantity,
    categories,
    selectedCategory,
    setSelectedSection,
    handleSubmit,
}) => {
    const subcategories = selectedCategory ? selectedCategory.subcategories : [];

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* SKU */}
            <div className="mb-4">
                <label className="block font-medium">SKU (Auto-generated):</label>
                <input
                    type="text"
                    value={sku}
                    readOnly
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                />
            </div>
            {/* Product Fields */}
            <div className="flex space-x-4">
                <div className="w-1/2">
                    <label className="block font-medium mb-1">Product Name</label>
                    <input
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        placeholder="Enter product name"
                    />
                </div>
                <div className="w-1/2">
                    <label className="block font-medium mb-1">Short Description</label>
                    <input
                        type="text"
                        value={shortDescription}
                        onChange={(e) => setShortDescription(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        placeholder="Enter short description"
                    />
                </div>
            </div>

            <div>
                <label className="block font-medium mb-1">Product Description</label>
                <textarea
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 h-84"
                    placeholder="Enter detailed description"
                />
            </div>

            <div className="flex space-x-4">
                <div className="w-1/2">
                    <label className="block font-medium mb-1">Brand</label>
                    <input
                        type="text"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        placeholder="Enter brand"
                    />
                </div>
                <div className="w-1/2">
                    <label className="block font-medium mb-1">Category</label>
                    <select
                        value={category}
                        onChange={(e) => {
                            setCategory(e.target.value);
                            setSubCategory("");
                        }}
                        required
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex space-x-4">
                <div className="w-1/2">
                    <label className="block font-medium mb-1">Sub Category</label>
                    <select
                        value={subCategory}
                        onChange={(e) => setSubCategory(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    >
                        <option value="">Select a sub category</option>
                        {subcategories.map((sub) => (
                            <option key={sub._id} value={sub._id}>
                                {sub.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="w-1/2">
                    <label className="block font-medium mb-1">Material</label>
                    <input
                        type="text"
                        value={material}
                        onChange={(e) => setMaterial(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        placeholder="Enter material"
                    />
                </div>
            </div>

            <div className="flex space-x-4">
                <div className="w-1/2">
                    <label className="block font-medium mb-1">Care Instructions</label>
                    <div className="flex flex-wrap gap-4">
                        {[
                            "Machine Wash",
                            "Hand Wash",
                            "Do Not Bleach",
                            "Tumble Dry Low",
                            "Iron Low",
                            "Dry Clean Only",
                        ].map((option) => (
                            <div key={option} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={option}
                                    value={option}
                                    checked={careInstructions.includes(option)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setCareInstructions((prev) => [...prev, option]);
                                        } else {
                                            setCareInstructions((prev) =>
                                                prev.filter((item) => item !== option)
                                            );
                                        }
                                    }}
                                    className="mr-2"
                                />
                                <label htmlFor={option} className="text-sm">{option}</label>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-1/2 flex flex-col justify-end mb-10">
                    <label className="block font-medium mb-1">Total Quantity</label>
                    <input
                        type="number"
                        value={totalQuantity}
                        readOnly
                        className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                    />
                </div>
            </div>
        </form>
    );
};
