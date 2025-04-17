import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { EditIcon, PlusIcon, TrashIcon } from 'lucide-react';

const SubcategoryList = ({ category, onAddSubcategory, onDeleteSubcategory, onUpdateSubcategory }) => {
    const [editMode, setEditMode] = useState({ active: false, id: null });

    const toggleEditMode = (id = null) => {
        if (editMode.active && editMode.id === id) {
            setEditMode({ active: false, id: null });
        } else {
            setEditMode({ active: true, id });
        }
    };

    return (
        <div className="col-span-5 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-black border-b border-black flex justify-between items-center">
                <h2 className="font-semibold text-white">{category.name} - Subcategories</h2>
            </div>
            <div className="p-4 grid grid-cols-1 gap-4">
                {category.subcategories?.map((subcategory) => (
                    <div key={subcategory._id} className="border border-gray-200 rounded-md p-3 flex flex-col">
                        <div className="flex items-start mb-1">
                            <div className="ml-3 flex-grow">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-medium text-lg">{subcategory.name}</h4>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => toggleEditMode(subcategory._id)}
                                            className="bg-gray-100 text-black hover:bg-gray-200 px-3 py-1 rounded-md text-sm flex items-center"
                                        >
                                            <EditIcon className="mr-1" />
                                            Edit Name
                                        </button>
                                        <button
                                            onClick={() => onDeleteSubcategory(subcategory._id)}
                                            className="text-gray-500 hover:text-black"
                                        >
                                            <TrashIcon />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-gray-500 mt-1">Stock: {subcategory.stock || 0}</p>
                            </div>
                        </div>
                        {editMode.active && editMode.id === subcategory._id && (
                            <div className="mt-3 border-t border-gray-200 pt-3">
                                <div className="flex items-center">
                                    <input
                                        type="text"
                                        defaultValue={subcategory.name}
                                        onBlur={(e) => {
                                            onUpdateSubcategory(subcategory._id, 'name', e.target.value);
                                            toggleEditMode(subcategory._id);
                                        }}
                                        className="flex-grow px-3 py-2 border border-gray-300 rounded-md text-sm"
                                    />
                                    <button
                                        onClick={() => toggleEditMode(subcategory._id)}
                                        className="ml-2 bg-gray-200 hover:bg-gray-300 p-2 rounded-md"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                {(!category.subcategories || category.subcategories.length === 0) && (
                    <div className="col-span-full p-4 text-center text-gray-500 border border-dashed border-gray-300 rounded-md">
                        No subcategories found. Click 'Add Subcategory' to create one.
                    </div>
                )}
                <div className="flex justify-end">
                    <button
                        onClick={onAddSubcategory}
                        className="bg-black hover:bg-gray-700 text-white px-3 py-2 m-3 rounded-md text-sm flex items-center"
                    >
                        <PlusIcon className="mr-1" />
                        Add Subcategory
                    </button>
                </div>
            </div>
        </div>
    );
};

SubcategoryList.propTypes = {
    category: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        subcategories: PropTypes.arrayOf(
            PropTypes.shape({
                _id: PropTypes.string.isRequired,
                name: PropTypes.string.isRequired,
                stock: PropTypes.number,
            })
        ),
    }).isRequired,
    onAddSubcategory: PropTypes.func.isRequired,
    onDeleteSubcategory: PropTypes.func.isRequired,
    onUpdateSubcategory: PropTypes.func.isRequired,
};

export default SubcategoryList;