import React from 'react';
import PropTypes from 'prop-types';
import { TrashIcon } from 'lucide-react';

const CategoryList = ({ categories, selectedCategoryId, onSelectCategory, onDeleteCategory }) => {

    return (
        <div className="col-span-3 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-black border-b border-gray-200">
                <h2 className="font-semibold text-white">Categories</h2>
            </div>
            <div className="overflow-y-auto max-h-[600px]">
                {categories.map((category) => (
                    <div
                        key={category._id}
                        className={`flex items-center p-3 border-b border-gray-100 cursor-pointer transition-colors ${category._id === selectedCategoryId ? 'bg-gray-100 border-l-4 border-l-black' : 'hover:bg-gray-50'
                            }`}
                        onClick={() => onSelectCategory(category._id)}
                    >
                        <div className="flex-shrink-0 mr-3">
                            <img
                                src={
                                    category.thumbnail ||
                                    'https://imgs.search.brave.com/BROTLDRy85AwUbXbbtJ-FE7APPpmEwDArmQ4-J-U2Ow/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNjM2/NDA5NjE4L3Bob3Rv/L3BvcnRyYWl0LW9m/LWEtc21pbGluZy1t/YW4uanBnP3M9NjEy/eDYxMiZ3PTAmaz0y/MCZjPVBKbXozcjZD/d1I4MlF3aG0zTG9O/WGJhQnMwM3FzZDZv/ZTBnM2NYd0N5dVU9'
                                }
                                alt={category.name}
                                className="w-10 h-10 rounded-md object-cover"
                            />
                        </div>
                        <div className="flex-grow">
                            <h3 className="font-medium">{category.name}</h3>
                            <p className="text-gray-500 text-sm truncate">
                                {category.description ? category.description.substring(0, 25) + '...' : 'No description'}
                            </p>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDeleteCategory(category._id);
                            }}
                            className="text-gray-500 hover:text-black ml-2"
                        >
                            <TrashIcon />
                        </button>
                    </div>
                ))}
                {categories.length === 0 && (
                    <div className="p-4 text-center text-gray-500">No categories found.</div>
                )}
            </div>
        </div>
    );
};

CategoryList.propTypes = {
    categories: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            description: PropTypes.string,
            thumbnail: PropTypes.string,
        })
    ).isRequired,
    selectedCategoryId: PropTypes.string,
    onSelectCategory: PropTypes.func.isRequired,
    onDeleteCategory: PropTypes.func.isRequired,
};

export default CategoryList;